/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // 这一行非常重要，它告诉 Tailwind 去哪里扫描你写的 className
    ],
    theme: {
      extend: {
        // 如果你想自定义动画，可以在这里添加，这也是我模板中用到的一些动画
        animation: {
          'fade-in-up': 'fadeInUp 0.8s ease-out',
          'fade-in-down': 'fadeInDown 0.5s ease-out',
        },
        keyframes: {
          fadeInUp: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeInDown: {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          }
        }
      },
    },
    plugins: [],
  }
  