import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    filename='scam_analyzer.log')
logger = logging.getLogger('ScamAnalyzer')

# Initialize Flask app with proper CORS settings
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})


# Synthetic data generator (replace with real data in production)
def generate_synthetic_scam_data():
    """Generate synthetic scam data for Union County cities"""
    cities = [
        "Elizabeth", "Plainfield", "Union Township", "Westfield", "Linden",
        "Rahway", "Summit", "Cranford", "Hillside", "Roselle",
        "Berkeley Heights", "Clark", "Roselle Park", "New Providence", "Scotch Plains",
        "Fanwood", "Garwood", "Kenilworth", "Mountainside", "Springfield", "Winfield"
    ]

    # Parameters that might correlate with scam rates
    np.random.seed(42)  # For reproducibility

    data = {
        'city': cities,
        'population': np.random.randint(5000, 130000, len(cities)),
        'median_income': np.random.randint(40000, 200000, len(cities)),
        'elderly_percentage': np.random.uniform(10, 25, len(cities)),
        'internet_usage': np.random.uniform(60, 95, len(cities)),
        'police_per_capita': np.random.uniform(1, 3, len(cities)),
        'prior_scam_reports': np.random.randint(10, 1000, len(cities)),
        'financial_institutions': np.random.randint(1, 15, len(cities)),
        'tech_literacy_score': np.random.uniform(50, 90, len(cities)),
    }

    # Calculate synthetic scam rates based on these features
    df = pd.DataFrame(data)

    # Create a synthetic formula for scam rates (this would be learned from real data)
    df['scam_rate'] = (
            0.4 * (100000 / df['median_income']) +
            0.2 * (df['elderly_percentage'] / 100) +
            0.2 * (df['prior_scam_reports'] / df['population'] * 1000) -
            0.1 * (df['tech_literacy_score'] / 100) -
            0.1 * (df['police_per_capita'])
    )

    # Normalize to a 0-100 scale
    min_rate = df['scam_rate'].min()
    max_rate = df['scam_rate'].max()
    df['scam_rate'] = 10 + 90 * (df['scam_rate'] - min_rate) / (max_rate - min_rate)

    # Add scam categories and their rates
    scam_categories = ['phone', 'email', 'text', 'in_person', 'social_media']
    for category in scam_categories:
        df[f'{category}_scam_rate'] = np.random.normal(df['scam_rate'], 5)
        df[f'{category}_scam_rate'] = df[f'{category}_scam_rate'].clip(1, 100)

    return df


# Load or generate data
try:
    # Try to load real data (in production)
    scam_data = pd.read_csv('union_county_scam_data.csv')
    logger.info("Loaded real scam data from CSV")
except:
    # Use synthetic data (for development)
    scam_data = generate_synthetic_scam_data()
    logger.info("Generated synthetic scam data")

    # Save for reference
    scam_data.to_csv('synthetic_union_county_scam_data.csv', index=False)


# Train a simple model
def train_scam_prediction_model():
    """Train a machine learning model to predict scam risk levels"""
    # Prepare features and target
    features = ['population', 'median_income', 'elderly_percentage',
                'internet_usage', 'police_per_capita', 'prior_scam_reports',
                'financial_institutions', 'tech_literacy_score']

    X = scam_data[features]
    y = scam_data['scam_rate']

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)

    return model, scaler, features


# Train model
model, scaler, model_features = train_scam_prediction_model()
logger.info("AI model trained successfully")


# API endpoint for scam data
@app.route('/api/scam-data', methods=['GET'])
def get_scam_data():
    """Return scam data for all cities"""
    result = []

    for _, row in scam_data.iterrows():
        city_data = {
            'city': row['city'],
            'scam_rate': round(row['scam_rate'], 1),
            'risk_level': get_risk_level(row['scam_rate']),
            'categories': {
                'phone': round(row['phone_scam_rate'], 1),
                'email': round(row['email_scam_rate'], 1),
                'text': round(row['text_scam_rate'], 1),
                'in_person': round(row['in_person_scam_rate'], 1),
                'social_media': round(row['social_media_scam_rate'], 1)
            },
            'population': int(row['population']),
            'analysis': generate_city_analysis(row)
        }
        result.append(city_data)

    logger.info(f"Scam data requested and returned for all cities")
    return jsonify(result)


# API endpoint for single city
@app.route('/api/city/<city_name>', methods=['GET', 'OPTIONS'])
def get_city_data(city_name):
    """Return detailed scam data for a specific city"""
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        # Handle special case for "Union"
        if city_name.lower() == 'union':
            city_name = 'Union Township'
            
        city_data = scam_data[scam_data['city'] == city_name]

        if city_data.empty:
            logger.warning(f"City data requested for unknown city: {city_name}")
            return jsonify({"error": "City not found"}), 404

        row = city_data.iloc[0]
        result = {
            'city': row['city'],
            'risk_score': round(float(row['scam_rate']), 1),
            'risk_level': get_risk_level(row['scam_rate']),
            'phone_scam_risk': round(float(row['phone_scam_rate']), 1),
            'email_scam_risk': round(float(row['email_scam_rate']), 1),
            'text_scam_risk': round(float(row['text_scam_rate']), 1),
            'in_person_scam_risk': round(float(row['in_person_scam_rate']), 1),
            'analysis': generate_city_analysis(row),
            'recommendations': generate_safety_recommendations(row)
        }
        
        logger.info(f"City data successfully returned for: {city_name}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error processing city data for {city_name}: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Helper functions
def get_risk_level(scam_rate):
    """Convert numerical scam rate to risk level category"""
    if scam_rate < 20:
        return "Very Low"
    elif scam_rate < 40:
        return "Low"
    elif scam_rate < 60:
        return "Moderate"
    elif scam_rate < 80:
        return "High"
    else:
        return "Very High"


def generate_city_analysis(city_data):
    """Generate AI analysis text for a city"""
    city = city_data['city']
    scam_rate = city_data['scam_rate']
    risk_level = get_risk_level(scam_rate)

    # Find highest and lowest scam categories
    categories = ['phone_scam_rate', 'email_scam_rate', 'text_scam_rate',
                  'in_person_scam_rate', 'social_media_scam_rate']
    category_rates = {cat.replace('_scam_rate', ''): city_data[cat] for cat in categories}
    highest_cat = max(category_rates.items(), key=lambda x: x[1])
    lowest_cat = min(category_rates.items(), key=lambda x: x[1])

    # Generate analysis
    analysis = f"{city} has a {risk_level.lower()} scam risk with an overall scam rate of {scam_rate:.1f}/100. "

    if scam_rate > 70:
        analysis += f"Residents should exercise high caution, particularly with {highest_cat[0]} scams, "
        analysis += f"which show the highest rate ({highest_cat[1]:.1f}/100). "
    elif scam_rate > 40:
        analysis += f"The most common scam type is {highest_cat[0]} ({highest_cat[1]:.1f}/100), "
        analysis += f"while {lowest_cat[0]} scams are less prevalent ({lowest_cat[1]:.1f}/100). "
    else:
        analysis += f"While the overall risk is {risk_level.lower()}, residents should still be cautious "
        analysis += f"about {highest_cat[0]} scams ({highest_cat[1]:.1f}/100). "

    # Add demographic factors
    if city_data['elderly_percentage'] > 20:
        analysis += f"The high elderly population ({city_data['elderly_percentage']:.1f}%) "
        analysis += "may contribute to increased vulnerability to certain scams. "

    if city_data['median_income'] > 120000:
        analysis += "Higher median income may make this area a target for sophisticated financial scams."
    elif city_data['median_income'] < 60000:
        analysis += "Residents may be vulnerable to financial hardship scams promising quick money."

    return analysis


def generate_safety_recommendations(city_data):
    """Generate safety recommendations based on city data"""
    recommendations = []

    # Base recommendations
    recommendations.append("Verify the identity of anyone requesting personal information")
    recommendations.append("Never send money to people you haven't met in person")

    # Add specific recommendations based on high scam categories
    if city_data['phone_scam_rate'] > 60:
        recommendations.append("Be wary of unsolicited phone calls claiming to be from government agencies")
        recommendations.append("Consider using a call screening service or app")

    if city_data['email_scam_rate'] > 60:
        recommendations.append("Use email filtering and never click suspicious links")
        recommendations.append("Enable two-factor authentication on all email and financial accounts")

    if city_data['text_scam_rate'] > 60:
        recommendations.append("Be cautious of text messages from unknown numbers with urgent requests")
        recommendations.append("Don't respond to text messages requesting personal information")

    if city_data['in_person_scam_rate'] > 60:
        recommendations.append("Ask for identification from anyone claiming to represent a company")
        recommendations.append("Verify service workers by calling the company directly")

    if city_data['social_media_scam_rate'] > 60:
        recommendations.append("Be cautious of friend requests from unknown people")
        recommendations.append("Never share financial or personal information through social media platforms")

    # Demographic-specific recommendations
    if city_data['elderly_percentage'] > 20:
        recommendations.append("Set up community education programs for elderly residents about common scams")

    return recommendations


# Start the server if script is run directly
if __name__ == '__main__':
    current_time = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    logger.info(f"Starting Scam Analyzer API at {current_time}")
    print(f"Current Date and Time (UTC): {current_time}")
    print("Starting Flask server on http://localhost:5000")
    # Enable debug mode and allow all hosts
    app.run(host='0.0.0.0', port=5000, debug=True)