module.exports = {
    apps : [{
      name : `PROSHOTS-API-${process.env.ACTIVE_BRANCH}`,
      script: 'app.js',
      watch: ['./lib/', './routes/']
    }]
  };
  