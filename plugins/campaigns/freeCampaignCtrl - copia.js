
/**
 * @ngdoc function
 * @name newappApp.controller:campaignMaterialsCtrl
 * @description
 * # campaignMaterialsCtrl
 * Controller of the newappApp
 */

angular.module('newApp')
  .controller('freeCampaignCtrl', function ($scope, CanvasFactory, ngDialog, $rootScope, $timeout, ngDragDrop, ImagesFactory, UtilsFactory, AppSettings, campaignService, objCampaign , $location, generalService) {

	$scope.CampaignSelected =  {

				"id_campaign" 	: "",
				"description" 	: "",
				"name" 			: "",
				"date_up" 		: "",
				"date_update" 	: "",
				"status" 		: ""
		}
		
	$scope.objectsC = [];
	$scope.factory = {};
	$scope.canvas = {};
	$scope.factory.stickersCount = 0;
	$scope.factory.photosCount = 0;
	$scope.factory.canvas = new fabric.Canvas("play_board");
	$scope.formSelected = false;
	$scope.imageSelected = false;
	$scope.canvasTarget = false;
	$scope.showFonts = false;
	$scope.paletteArray = [];
	$scope.fontArray = [];
	$scope.paletteArrayCopy = [];
	$scope.liStyle = "1px solid black";
	$scope.showImages = 0;
	$scope.showImagesIdentity = 0;
	$scope.showImagesCampaign = 0;
	$scope.showFontsCampaign = 0;
	$scope.canvasWidth = "700";
	$scope.canvasHeight = "500";
	$scope.materialArray = [];
	$scope.adminNotified = false;
	var newPaletteO = { id_palette: 0, color: '' };
	newPaletteO.id_palette = $scope.paletteArray.length+2150;
	newPaletteO.color = "#000000";
	$scope.paletteArray.push(newPaletteO);
	var newPalette2 = { id_palette: 0, color: '' };
	newPalette2.id_palette = $scope.paletteArray.length+1;
	newPalette2.color = "#FFFFFF";
	$scope.paletteArray.push(newPalette2);
	// newPaletteO.id_palette = $scope.paletteArray.length+1;
	// newPaletteO.color = "#FFFFFF";
	// $scope.paletteArray.push(newPaletteO);
	
	console.log($scope.paletteArray);
	
	$scope.newPalette = function(newColor){
		var newPaletteR = { id_palette: 0, color: '' };
		newPaletteR.id_palette = $scope.paletteArray.length+2150;
		newPaletteR.color = newColor;
		$scope.paletteArray.push(newPaletteR);
	};
	
	$scope.notifyAdministrador = function(){
		$scope.adminNotified = true;
		
		var params = {
				"company_p" : "",
				"user_p"	: ""
			}
			params.company_p = $scope.currentUser.fk_company;
			params.user_p 	 = $scope.currentUser.name;
			
			generalService.NotifyAdministratorFreeCampaign(params)
			.then(function(data) {
				
			})
		
		var historyUser = {
				"user_p" 		: "",
				"message_p"		: "",
				"campaign_p"	: ""
			}
			
			historyUser.user_p		= $scope.currentUser.id_user;
			historyUser.message_p	= "Inicio campaña libre";
			historyUser.campaign_p 	= 0;
			
			generalService.AddHistory(historyUser)
			.then(function(data) {
				
			})
	}
	
	$scope.materialSelect = function(material){
		$scope.canvasWidth = material.width;
		$scope.canvasHeight = material.height;
		
		for (var i in $scope.materialArray){
			$scope.materialArray[i].style="";
		}
		
		material.style="1px solid black";
	}
	
	$scope.seeImagesIdentity = function(){
		$scope.showImagesIdentity = 1;
	}
	$scope.seeImages = function(){
		$scope.showImagesCampaign = 1;
	}
	$scope.hideImages = function(){
		$scope.showImagesCampaign = 0;
	}
	$scope.hideImagesIdentity = function(){
		$scope.showImagesIdentity = 0;
	}
	$scope.seeFonts = function(){
		console.log("onFonts");
		$scope.showFontsCampaign = 1;
	}
	$scope.hideFonts = function(){
		$scope.showFontsCampaign = 0;
	}
	
	$scope.uploadSticker = function(){
		$timeout(function () {
		  //Notify $digest cycle hack
		  $('#sticker_upload').trigger('click');
		}, 0);
	}
	
	// $scope.onFileUpload = function(){
		// // var guid = UtilsFactory.guid();
		// var image = {
			// guid: guid,
			// src: $scope.previewImages[0]
		// };
		// $scope.images.push(image);
		// ImagesFactory.savePhotoImage(image);
		// // UtilsFactory.resetUsedFileStorageSpace(); //Reset the $rootScope file storage for header data update
		// $scope.previewImages = [];
	// }
	
	objCampaign.getCampaign()
		.then(function(data) {

			$scope.CampaignSelected.id_campaign = data.id_campaign;
			$scope.CampaignSelected.description = data.description;
			$scope.CampaignSelected.name 		= data.name;
			$scope.CampaignSelected.date_up 	= data.date_up;
			$scope.CampaignSelected.date_update = data.date_update;
			$scope.CampaignSelected.status 		= data.status;			

			var params = {
				"campaign_p" : ""
			}
			params.campaign_p = $scope.CampaignSelected.id_campaign;
			$scope.images = [];
			$scope.imagesIdentity = [];
			
			campaignService.getMaterials(params)
			.then(function(data) {
				// for (var i in data){
					// if(data[i].free === 1 || data[i].free === "1"){
						// data[i].style="";
						// // $scope.materialArray.push(data[i]);
					// }					
				// }
				
				$scope.materialArray = data;
				
				for (var i in $scope.materialArray){
					$scope.materialArray[i].style="";
				}
			})
		})
	
	$scope.factory.canvas.on({
	  'object:moving': function objectMoving(e) {
		$rootScope.$broadcast('objectMoving', e);
	  },
	  'object:selected': function objectSelected(e) {
		$rootScope.$broadcast('objectSelected', e);
	  },
	  'selection:cleared': function selectionCleared(e) {
		$rootScope.$broadcast('objectCleared', e);
	  },
	  'object:modified': function objectModified(e) {
		$rootScope.$broadcast('objectModified', e);
	  },
	  'object:added': function objectAdded(e) {
		$rootScope.$broadcast('objectAdded', e);
	  },
	  'object:removed': function objectRemoved(e) {
		$rootScope.$broadcast('objectRemoved', e);
	  },
	  'path:created': function pathCreated(e) {
		$rootScope.$broadcast('pathCreated', e);
	  }
	});
	
		//*stickers*//
		
		
	  $scope.images = [{
		title: "2x1",
		src: "images/2x1.png",
		isUserUploaded: false
	  }, {
		title: "Cinepolis",
		src: "images/cinepolis.png",
		isUserUploaded: false
	  }, {
		title: "Fondo",
		src: "images/fondo.png",
		isUserUploaded: false
	  }, {
		title: "Palomitas",
		src: "images/palomitas.png",
		isUserUploaded: false
	  }, {
		title: "Personas",
		src: "images/personascin.png",
		isUserUploaded: false
	  }, {
		title: "Sala",
		src: "images/sala.png",
		isUserUploaded: false
	  }];


	  //Restore Stored Stickers
	  var stickersImgs = ImagesFactory.getRestoredStickerImages($scope.images);
	  $scope.images = stickersImgs;

	  $scope.uploaded = false;
	  $scope.title = "";
	  $scope.previewImages = [];

	  //Drag & Drop Styles
	  $scope.styles = {
		draggables: {
		  onDragging: { border: "1px dashed #000", cursor: "move" },
		  onStart: { opacity: 0.5 }
		},
		droppables: {
		  onEnter: { border: "1px dashed #2DA43E" },
		  onLeave: { border: "" }
		}
	  };

	  //Drag Drop Events Callbacks
	  $scope.dragCallback = function (event) {
		console.log("Dragging", event);
	  };

	  $scope.dropCallback = function (event) {
		var currDragElem = ngDragDrop.getCurrentDragElement();
		var imgSrc = currDragElem.attr("src");
		var object = {
		  src: imgSrc,
		  drop: true
		};
		$scope.dropImage(object, event);
		console.log("Dropped", event);
	  };

	  $scope.overCallback = function (event) {
		console.log("Drag Over", event);
	  };

	  //Delete Sticker
	  $scope.deleteSticker = function (image) {
		var index = $scope.images.indexOf(image);
		$scope.images.splice(index, 1);
		ImagesFactory.deleteStickerImage(image); //delete from persisted localStorage
		UtilsFactory.resetUsedFileStorageSpace(); //Reset the $rootScope file storage for header data update
	  };

	  //callback function once file is uploaded
	  $scope.onFileUpload = function () {
		// var guid = UtilsFactory.guid();
		
		var image = {
			// guid: guid,
			src: $scope.previewImages[0]
		};
		$scope.images.push(image);
		// ImagesFactory.savePhotoImage(image);
		console.log($scope.images);
		console.log("preview");
		console.log($scope.previewImages);
		// UtilsFactory.resetUsedFileStorageSpace(); //Reset the $rootScope file storage for header data update
		$scope.previewImages = [];
		var sticker = {
		  src: $scope.previewImages[0],
		  title: "Nueva imagen",
		  isUserUploaded: true
		};
		ImagesFactory.saveStickerImage(sticker);
		
	  };

	  //submit sticker
	  $scope.submitSticker = function (form) {
		// var guid = UtilsFactory.guid();
		var sticker = {
		  src: $scope.previewImages[0],
		  title: $scope.newImage,
		  isUserUploaded: true
		};

		// if (form.$valid && $scope.previewImages.length) {
		  //if form is valid perform action
		  // form.$setPristine();
		  // form.$setUntouched();
		  $scope.uploaded = false;
		  // $scope.images.push(sticker);
		  ImagesFactory.saveStickerImage(sticker); //Persist Sticker Image
		  // UtilsFactory.resetUsedFileStorageSpace(); //Reset the $rootScope file storage for header data update
		  $scope.previewImages = []; //Reset the images
		  // ngDialog.close();
		// }
	  };

	  //upload sticker
	  $scope.uploadSticker = function () {
		$timeout(function () {
		  //Notify $digest cycle hack
		  $('#sticker_upload').trigger('click');
		}, 0);
	  };

	  //open upload dialog
	  $scope.openUploadDialog = function () {
		if (0 >= 1) { //AppSettings.maxStorageSpace
		  //if storage exceed max app provided storage space then throw error
		  alert("Exceeded max provided localstorage space. Please empty to save.");
		} else {
		  //open dialog to save
		  ngDialog.open({
			template: 'design/stickerDialog.html',
		  });
		}
	  };

	  //Add Image to Canvas Area
	  $scope.dropImage = function (obj, $event) {
		// var canvas = CanvasFactory.getCanvas();
		// $scope.objectsC = canvas._objects;
		var PosX = undefined,
			PosY = undefined;
		if (obj.drop === true) {
		  PosX = $event.clientX - $event.currentTarget.offsetLeft - 50;
		  PosY = $event.clientY - $event.currentTarget.offsetTop - 54; //offset height of header
		}
		fabric.Image.fromURL(obj.src, function (oImg) {
		  if (obj.drop === true) {
			oImg.set('left', PosX).set('top', PosY);
		  }
			$scope.factory.canvas.centerObject(oImg);
			$scope.factory.canvas.add(oImg);
			$scope.factory.canvas.renderAll();
		  // canvas.add(oImg);
		});
	  };
	  
	  	//*canvas*//

	  $scope.isObjectSelected = false;

	  //on object selection
	  $rootScope.$on("objectSelected", function () {
		$timeout(function () {
		  $scope.isObjectSelected = true;
		  $scope.canvasTarget = false;
		  var activeObject = $scope.factory.canvas.getActiveObject();
		  console.log(activeObject);
		  if(activeObject.type === "circle" || activeObject.type === "triangle" 
				|| activeObject.type === "rect" || activeObject.type === "i-text"
				|| activeObject.type === "line"){
				$scope.formSelected = true;
				
				if(activeObject.type === "i-text"){
					$scope.showFonts = true;
				}
				else{
					$scope.showFonts = false;
				}
				
		  }else{
			    $scope.formSelected = false;
				$scope.showFonts = false;
		  }
		  if(activeObject.type === "image" ){
				$scope.imageSelected = true;
				$scope.showFonts = false;
		  }else{
			    $scope.imageSelected = false;
		  }
		}, 0);
	  });
	  
	  $scope.changeFormColor = function(pal){
			
			var activeObject = $scope.factory.canvas.getActiveObject();
			console.log(activeObject.type);
			if(activeObject.type === "circle" || activeObject.type === "triangle" 
				|| activeObject.type === "rect" || activeObject.type === "i-text"){
				activeObject.setFill(pal.color);	
			}
			
			if(activeObject.type === "line"){
				activeObject.setStroke(pal.color);	
			}
			
			$scope.factory.canvas.renderAll();
			// activeObject.setColor(pal.color);
	  }
	  
	  var download = function download(url, name) {
		angular.element('<a>').attr({ href: url, download: name })[0].click();
	  };
		  
	  $scope.exportAs = function(name) {
		
		download($scope.factory.canvas.toDataURL(), 'wizad_design.png');
	  }
	  // $scope.changeFormColor = function(pal){
			// var activeObject = $scope.factory.canvas.getActiveObject();
		
			// activeObject.setFill(pal.color);
			// $scope.factory.canvas.renderAll();
			// // activeObject.setColor(pal.color);
	  // }
	  
	  $scope.canvasIsTargeted = function(){
		  $scope.canvasTarget = true;
		  $scope.formSelected = false;
		  $scope.factory.canvas.deactivateAll().renderAll();
	  }
	  
	  $scope.changeTextFont = function(font){
		  var activeObject = $scope.factory.canvas.getActiveObject();
		  activeObject.fontFamily = font.font;
		  $scope.factory.canvas.renderAll();
		  console.log(font.font);
		  // var text = "Escribe tu texto..";
		  // var fontColor = $scope.paletteArray[0].color;
		  // var textSample = new fabric.IText(text, {
			  // left: fabric.util.getRandomInt(10, 100),
			  // top: fabric.util.getRandomInt(10, 200),
			  // fontFamily: font.font,
			  // angle: 0,
			  // fill: fontColor,
			  // scaleX: 0.5,
			  // scaleY: 0.5,
			  // fontWeight: '',
			  // hasRotatingPoint: true
			// });
		// $scope.factory.canvas.add(textSample);
		// $scope.factory.canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
		// $scope.factory.canvas.setActiveObject(textSample);
		// $scope.factory.canvas.renderAll();
	  }

	  //on object cleared
	  $rootScope.$on("objectCleared", function () {
		$timeout(function () {
		  $scope.formSelected = false;
		  $scope.imageSelected = false;
		  $scope.isObjectSelected = false;
		  $scope.showFonts = false;
		}, 0);
	  });

	  //delete selected object
	  $scope.deleteSelectedObject = function () {
		var canvas = CanvasFactory.getCanvas();
		var activeObject = $scope.factory.canvas.getActiveObject();
		$scope.factory.canvas.remove(activeObject);
	  };
	  
	  $scope.addLine = function(){
		var fontColor = $scope.paletteArray[0].color;
		
		var lineSample = new fabric.Line([50, 100, 200, 200], {
			left: 170,
			top: 150,
			stroke: fontColor
		});
		
		$scope.factory.canvas.add(lineSample);
	  }

	  //add text
	  $scope.addText = function () {
		// var canvas = CanvasFactory.getCanvas();
		var text = "Escribe tu texto..";
		var fontColor = $scope.paletteArray[0].color;
		var fontFamily = "Allerta+Stencil";
		var textSample = new fabric.IText(text, {
		  left: fabric.util.getRandomInt(10, 100),
		  top: fabric.util.getRandomInt(10, 200),
		  fontFamily: 'Raleway-Bold.ttf',
		  angle: 0,
		  fill: fontColor,
		  scaleX: 0.5,
		  scaleY: 0.5,
		  fontWeight: '',
		  hasRotatingPoint: true
		});
		$scope.factory.canvas.add(textSample);
		$scope.factory.canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
		$scope.factory.canvas.setActiveObject(textSample);
	  };

	  //paint the canvas
	  $scope.paintBrush = function () {
		alert("Sorry :( not yet implemented...");
	  };

	  
	  
	  
	  //reset the board
	  $scope.resetBoard = function () {
		var canvas = CanvasFactory.getCanvas();
		canvas.clear();
	  };
	  
		$scope.changeCanvasColor = function(pal){
			$scope.factory.canvas.backgroundColor=pal.color;
			$scope.factory.canvas.renderAll();
			$scope.canvasTarget = false;
			// $scope.factory.canvas.renderTop();
		}
		
		$scope.addCircle = function(){
			
			var circle=new fabric.Circle({
				top: 150,
				left: 150,
				radius: 99,
				fill: $scope.paletteArray[0].color
			});
			$scope.factory.canvas.add(circle);
		}
		
		$scope.addTriangle = function(){
			
			var triangle=new fabric.Triangle({
				top: 150,
				left: 150,
				radius: 99,
				fill: $scope.paletteArray[0].color
			});
			$scope.factory.canvas.add(triangle);
		}
		
		$scope.addRectangle = function(){
			
			var rectangle=new fabric.Rect({
				left: 100,
				top: 50,
				width: 100,
				height: 100,
				fill: $scope.paletteArray[0].color,
				angle: 20,
				padding: 10
			});
			$scope.factory.canvas.add(rectangle);
		}
		
		$scope.moveToFront = function(){
			var activeObject = $scope.factory.canvas.getActiveObject();
			$scope.factory.canvas.bringToFront(activeObject);
		}
		$scope.moveToBack = function(){
			var activeObject = $scope.factory.canvas.getActiveObject();
			$scope.factory.canvas.sendToBack(activeObject);
		}
		$scope.moveToBackward = function(){
			var activeObject = $scope.factory.canvas.getActiveObject();
			$scope.factory.canvas.sendBackwards(activeObject);
		}
		$scope.moveToForward = function(){
			var activeObject = $scope.factory.canvas.getActiveObject();
			$scope.factory.canvas.bringForward(activeObject);
		}
		$scope.saveCanvas = function(){
			
		}
		$scope.exportImg = function(){
			var objects = $scope.getCanvasObjects();
			if (objects.length !== 0) {
			  ngDialog.open({
				template: 'design/downloadDialog.html',
				closeByDocument: true,
				closeByEscape: true,
				scope: $scope
			  });
			} else {
			  alert("Nothing on sticker board!!");
			}
		}
		
		$scope.getCanvasObjects = function() {
			
			return $scope.factory.canvas.getObjects();
		}
		
  });
