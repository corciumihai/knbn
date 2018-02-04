var React = require('react')
  , assign = require('object-assign')

var DEFAULT_OPTIONS = {
	mountNodeId: 'app',
	moduleRoot: null
}

module.exports = function(options){
	options = assign({}, DEFAULT_OPTIONS, options || {})

	return function expressReact(req, res, next) {
		res.document = { doctype:'html' }
		res.render = createClientRenderer(req, res, next)
		res.props = {}
		next()
	}

	function createClientRenderer(req, res, next) {
		return function render(Component, props) {
			props = assign({}, res.props, props || {})

			var element = React.createElement(Component, props)
			  , mountNode = document.getElementById(options.mountNodeId)

			document.title = res.document.title

			React.render(element, mountNode)
		}
	}
}