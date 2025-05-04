module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://20.244.56.144/evaluation-service/:path*', // API URL
        },
      ];
    },
  };
  