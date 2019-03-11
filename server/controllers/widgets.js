var mongoose = require("mongoose"),

Widget = require("../models/widget.js");
var dateFormat = require('dateformat');


function WidgetsController() {

  //organizer landing page
	this.index = function(req, res) {
		Widget.find({}, function(err, widgets) {
			if (err) {
				console.log(err);
			} else {
				res.render("widgetCreate", {
					widgets: widgets,
				});
			}
		});
	};
      


//Just used as an API for now
	this.create = function(req, res) {
		console.log(Date.now()," - 200 widgets.js this.create.  req.body = ",req.body);
		console.log(Date.now()," - 201 widgets.js this.create.  req.file = ",req.file);
		Widget.create(
			{
			name: req.body.name,
			widgetImage: req.body.imgFileName,
			},
			function(err, result) {
				if (err) {
					console.log(Date.now(),": err = ",err);
				} else {
					console.log(Date.now()," - 206 widgets.js post widget create.  req.body = ",req.body);
					console.log(Date.now()," - 207 widgets.js post widget create.  req.file = ",req.file);
					console.log(Date.now()," - 208 widgets.js post widget create.  result = ",result);

					// res.redirect("/" + result._id + "/organizerMenu");
					res.redirect("/widget");
				}
			}
		);
	};

	// this.menu = function(req, res) {
	// 	if (globals.adminValidation(req, res)) {
	// 		Widget.findById(req.params.widgets, function(err, widgetDetails) {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log("widget details", widgetDetails);
	// 				res.render("organizerMenu", {
	// 					page: "organizerMenu",
	// 					widget: req.params.widgets,
	// 					widgetDetails: widgetDetails,
	// 				});
	// 			}
	// 		});
	// 	}
	// };


	// this.edit = function(req, res) {
	// 	console.log(Date.now()," - 210 widgets.js this.edit.  req.body = ",req.body);
	// 	console.log(Date.now()," - 211 widgets.js this.edit.  req.file = ",req.file);
	// 	Widget.findById(req.params.widgets, function(err, widget) {
	// 		console.log(Date.now()," - 212 widgets.js this.edit.  widget = ",widget);
	// 		res.render("editWidget", {
	// 			widgetDetails: widget,
	// 			widget: req.params.widgets,
	// 			headerImage: widget.headerImage

	// 		});
	// 	});
	// };


	// this.update = function(req, res) {
	// 	console.log(Date.now()," - 220 widgets.js this.update.  req.body = ",req.body);
	// 	console.log(Date.now()," - 221 widgets.js this.update.  req.file = ",req.file);

	// 	Widget.findById(req.params.widgets, function(err, widget) {
	// 		console.log(Date.now()," - 222 widgets.js this.update.  widget = ",widget);
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			widget.name = req.body.name || widget.name;
	// 			widget.headerImage = req.body.imgFileName
	// 			console.log(Date.now()," - 223 widgets.js this.update pre save.  widget = ",widget);
	// 			widget.save()
	// 			console.log(Date.now()," - 224 widgets.js this.update post save.  widget = ",widget);
	// 			console.log(Date.now()," - 225 widgets.js this.update post save.  req.params.widgets = ",req.params.widgets);
	// 			res.redirect("/" + req.params.widgets + "/organizerMenu")
	// 		}
	// 	});
	// };

//   this.deletewidget = function(req, res) {
//     Widget.remove({ _id: req.params.widgets }, function(err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect("/widgets/main");
//       }
//     });
//   };

}

module.exports = new WidgetsController();
