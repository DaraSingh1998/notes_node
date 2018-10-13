if (process.env.NODE_ENV=='production') {
  module.exports={mongoURI:'mongodb://Dara:Dragonballzgt1@ds131373.mlab.com:31373/notes-product'}
}else {
  module.exports={mongoURI:'mongodb://localhost/notes-dev'}
}
