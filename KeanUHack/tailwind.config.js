/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '101': '1.01',
        '102': '1.02',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
            'background-size': '200% 200%',
          },
          '50%': {
            'background-position': '100% 50%',
            'background-size': '200% 200%',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
            filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))',
          },
          '50%': {
            transform: 'translateY(-15px)',
            filter: 'drop-shadow(0 20px 8px rgb(0 0 0 / 0.04))',
          }
        },
        'pulse-subtle': {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '50%': {
            opacity: 0.95,
            transform: 'scale(1.01)',
          },
        },
        'title-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(-1deg)',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(1deg)',
          }
        },
        'container-float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(0.5deg)',
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          }
        },
        'fade-in-up-delayed': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
          '20%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '80%': {
            opacity: '1',
            transform: 'translateY(0)',
          }
        },
        'bubble-float': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
            opacity: 0,
          },
          '50%': {
            transform: 'translateY(-40vh) translateX(10vw)',
            opacity: 1,
          }
        },
        'bubble-diagonal': {
          '0%, 100%': {
            transform: 'translate(0, 0)',
            opacity: 0,
          },
          '50%': {
            transform: 'translate(30vw, -30vh)',
            opacity: 1,
          }
        },
        'bubble-zigzag': {
          '0%, 100%': {
            transform: 'translate(0, 0)',
            opacity: 0,
          },
          '25%': {
            transform: 'translate(20vw, -15vh)',
          },
          '50%': {
            transform: 'translate(-10vw, -30vh)',
            opacity: 1,
          },
          '75%': {
            transform: 'translate(15vw, -45vh)',
          }
        },
        'security-ping': {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'scale(2)',
            opacity: 0,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0.5,
          }
        },
        'radar-sweep': {
          'from': {
            transform: 'rotate(0deg)',
          },
          'to': {
            transform: 'rotate(360deg)',
          }
        },
        'float-alert': {
          '0%, 100%': {
            transform: 'translate(0, 0)',
            opacity: 0.6,
          },
          '50%': {
            transform: 'translate(100px, -50px)',
            opacity: 1,
          }
        },
        'scan-line': {
          '0%': {
            transform: 'translateY(0) translateX(-100%)',
          },
          '100%': {
            transform: 'translateY(0) translateX(100%)',
          }
        },
        'alert-dot': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: 0.2,
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: 0.8,
          }
        },
        'move-1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -40px)' },
        },
        'move-2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-30px, -30px)' },
        },
        'move-3': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(30px, 30px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'gradient-slow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-left-right': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(100px)' }
        },
        'float-right-left': {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-100px)' }
        },
        'float-lr-slow': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(150px)' }
        },
        'float-horizontal': {
          '0%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(100px)' },
          '100%': { transform: 'translateX(0px)' },
        },
        'float-horizontal-reverse': {
          '0%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-100px)' },
          '100%': { transform: 'translateX(0px)' },
        },
        'bubble-move': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' }
        },
        'bubble-move-reverse': {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'float-slow': {
          '0%, 100%': { 
            transform: 'translate(0px, 0px)' 
          },
          '50%': { 
            transform: 'translate(20px, -20px)' 
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        'gradient-slow': 'gradient-slow 15s ease infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-very-slow': 'spin 8s linear infinite',
        'float-slow': 'float-slow 15s ease-in-out infinite',
        'float-slow-delay': 'float-slow 15s ease-in-out -5s infinite',
        'float-slow-alt': 'float-slow 20s ease-in-out -10s infinite',
        'float-delayed': 'float 8s ease-in-out infinite 2s',
        'float-quick': 'float 6s ease-in-out infinite 1s',
        'title-float': 'title-float 6s ease-in-out infinite',
        'container-float': 'container-float 8s ease-in-out infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-up-delayed': 'fade-in-up 0.8s ease-out 0.2s forwards',
        'bubble-float-slow': 'bubble-float 20s ease-in-out infinite',
        'bubble-float-medium': 'bubble-float 15s ease-in-out infinite',
        'bubble-float-fast': 'bubble-float 10s ease-in-out infinite',
        'bubble-float-delayed': 'bubble-float 18s ease-in-out 2s infinite',
        'bubble-diagonal': 'bubble-diagonal 25s ease-in-out infinite',
        'bubble-zigzag': 'bubble-zigzag 20s ease-in-out infinite',
        'pulse-delayed': 'pulse 4s ease-in-out 2s infinite',
        'security-ping-0': 'security-ping 8s ease-in-out infinite',
        'security-ping-1': 'security-ping 8s ease-in-out 2s infinite',
        'security-ping-2': 'security-ping 8s ease-in-out 4s infinite',
        'security-ping-3': 'security-ping 8s ease-in-out 6s infinite',
        'security-ping-4': 'security-ping 8s ease-in-out 8s infinite',
        'ping-slow': 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'float-alert': 'float-alert 10s ease-in-out infinite',
        'float-alert-delayed': 'float-alert 10s ease-in-out 5s infinite',
        'move-1': 'move-1 15s infinite ease-in-out',
        'move-2': 'move-2 12s infinite ease-in-out',
        'move-3': 'move-3 18s infinite ease-in-out',
        'spin-slow': 'spin-slow 8s linear infinite',
        'gradient-slow': 'gradient-slow 15s ease infinite',
        'float-left-right': 'float-left-right 8s ease-in-out infinite',
        'float-right-left': 'float-right-left 8s ease-in-out infinite',
        'float-lr-slow': 'float-lr-slow 20s infinite ease-in-out',
        'float-horizontal': 'float-horizontal 15s ease-in-out infinite',
        'float-horizontal-reverse': 'float-horizontal-reverse 15s ease-in-out infinite',
        'bubble-move': 'bubble-move 20s linear infinite',
        'bubble-move-reverse': 'bubble-move-reverse 25s linear infinite',
      }
    }
  },
  plugins: [],
} 