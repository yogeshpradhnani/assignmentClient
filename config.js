const config = {
    image: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/image.png'
      : '/assets/image.png',
    barChart: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/barChart.png'
      : '/assets/barChart.png',
      target: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/target.png'
      : '/assets/target.png',
      Domain: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/Domain.png'
      : '/assets/Domain.png',
      Polygon: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/Polygon.png'
      : '/assets/Polygon.png',
      report: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/report.png'
      : '/assets/report.png',
      logoPlaceholder: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/logo.png'
      : '/assets/logo.png',
      facebook: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/facebook.png'
      : '/assets/facebook.png',
    
      youtube: process.env.NODE_ENV === 'production'
      ? '`https://upMyTeam.`com/upMyTeam/assets/youtube.png'
      : '/assets/youtube.png',
      mail: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/mail.png'
      : '/assets/mail.png',
      instagram: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/instagram.png'
      : '/assets/instagram.png',
    
      linkedin: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/linkedin.png'
      : '/assets/linkedin.png',
      call: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/call.png'
      : '/assets/call.png',
      about: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/about.png'
      : '/assets/about.png',
      story: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/story.png'
      : '/assets/story.png',
      vision: process.env.NODE_ENV === 'production'
      ? 'https://upMyTeam.com/upMyTeam/assets/vision.png'
      : '/assets/vision.png',
      api : process.env.NODE_ENV === 'production' ?
      'https://assignmentbackend-2-pjsa.onrender.com/api/v1'
      : 'https://assignmentbackend-2-pjsa.onrender.com/api/v1',
      img : process.env.NODE_ENV === 'production' ?
      'https://assignmentbackend-2-pjsa.onrender.com'
      : 'https://assignmentbackend-2-pjsa.onrender.com'

      
  };
  
        
  export default config;