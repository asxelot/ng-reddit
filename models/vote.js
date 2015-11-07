module.exports = function(n, username) {
  var vote = n > 0 ? 'upvotes' : 'downvotes'

  if (~this[vote].indexOf(username))
    this[vote].pull(username)
  else
    this[vote].push(username)

  this[n < 0 ? 'upvotes' : 'downvotes'].pull(username)

  return this.save()
}
