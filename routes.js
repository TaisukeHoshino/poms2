const routes = require('next-routes')();

routes
.add('/admin/manufacturers/new', '/admin/manufacturers/new')
.add('/admin/manufacturers/:manufacturerId', '/admin/manufacturers/show')
.add('/manufacturer/products/new', '/manufacturer/products/new')
.add('/manufacturer/products/:epc', '/manufacturer/products/show');


module.exports = routes;
