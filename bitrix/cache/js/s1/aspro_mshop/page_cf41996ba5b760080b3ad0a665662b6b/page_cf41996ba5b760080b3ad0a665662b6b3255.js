
; /* Start:"a:4:{s:4:"full";s:94:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.element/main/script.js?145940620978542";s:6:"source";s:78:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.element/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function (window) {

if (!!window.JCCatalogElement)
{
	return;
}

var BasketButton = function(params)
{
	BasketButton.superclass.constructor.apply(this, arguments);
	this.nameNode = BX.create('span', {
		props : { className : 'bx_medium bx_bt_button', id : this.id },
		style: typeof(params.style) === 'object' ? params.style : {},
		text: params.text
	});
	this.buttonNode = BX.create('span', {
		attrs: { className: params.ownerClass },
		children: [this.nameNode],
		events : this.contextEvents
	});
	if (BX.browser.IsIE())
	{
		this.buttonNode.setAttribute("hideFocus", "hidefocus");
	}
};
BX.extend(BasketButton, BX.PopupWindowButton);

window.JCCatalogElement = function (arParams)
{
	this.skuVisualParams = {
		SELECT:
		{
			TAG_BIND: 'select',
			TAG: 'option',
			ACTIVE_CLASS: 'active',
			HIDE_CLASS: 'hidden',
			EVENT: 'change',
		},
		LI:
		{
			TAG_BIND: 'li',
			TAG: 'li',
			ACTIVE_CLASS: 'active',
			HIDE_CLASS: 'missing',
			EVENT: 'click',
		}
	};
	this.productType = 0;

	this.config = {
		useCatalog: true,
		showQuantity: true,
		showPrice: true,
		showAbsent: true,
		showOldPrice: false,
		showPercent: false,
		showSkuProps: false,
		showOfferGroup: false,
		useCompare: false,
		mainPictureMode: 'IMG',
		showBasisPrice: false,
		basketAction: ['BUY'],
		showClosePopup: false
	};

	this.basketLinkURL = '';

	this.checkQuantity = false;
	this.maxQuantity = 0;
	this.SliderImages=0;
	this.defaultCount = 1;
	this.stepQuantity = 1;
	this.isDblQuantity = false;
	this.canBuy = true;
	this.currentBasisPrice = {};
	this.canSubscription = true;
	this.currentIsSet = false;
	this.updateViewedCount = false;

	this.precision = 6;
	this.precisionFactor = Math.pow(10,this.precision);

	this.listID = {
		main: ['PICT_ID', 'BIG_SLIDER_ID', 'BIG_IMG_CONT_ID'],
		stickers: ['STICKER_ID'],
		productSlider: ['SLIDER_CONT', 'SLIDER_LIST', 'SLIDER_LEFT', 'SLIDER_RIGHT'],
		offerSlider: ['SLIDER_CONT_OF_ID', 'SLIDER_LIST_OF_ID', 'SLIDER_LEFT_OF_ID', 'SLIDER_RIGHT_OF_ID'],
		offerSliderMobile: ['SLIDER_CONT_OFM_ID', 'SLIDER_LIST_OFM_ID', 'SLIDER_LEFT_OFM_ID', 'SLIDER_RIGHT_OFM_ID'],
		offers: ['TREE_ID', 'TREE_ITEM_ID', 'DISPLAY_PROP_DIV', 'DISPLAY_PROP_ARTICLE_DIV', 'OFFER_GROUP'],
		quantity: ['QUANTITY_ID', 'QUANTITY_UP_ID', 'QUANTITY_DOWN_ID', 'QUANTITY_MEASURE', 'QUANTITY_LIMIT', 'BASIS_PRICE'],
		price: ['PRICE_ID'],
		oldPrice: ['OLD_PRICE_ID', 'DISCOUNT_VALUE_ID'],
		discountPerc: ['DISCOUNT_PERC_ID'],
		basket: ['BASKET_PROP_DIV', 'BUY_ID', 'BASKET_LINK', 'ADD_BASKET_ID', 'BASKET_ACTIONS_ID', 'NOT_AVAILABLE_MESS', 'SUBSCRIBE_ID', 'SUBSCRIBED_ID'],
		magnifier: ['MAGNIFIER_ID', 'MAGNIFIER_AREA_ID'],
		compare: ['COMPARE_LINK_ID']
	};

	this.visualPostfix = {
		// main pict
		PICT_ID: '_pict',
		BIG_SLIDER_ID: '_big_slider',
		BIG_IMG_CONT_ID: '_bigimg_cont',
		// stickers
		STICKER_ID: '_sticker',
		// product pict slider
		SLIDER_CONT: '_slider_cont',
		SLIDER_LIST: '_slider_list',
		SLIDER_LEFT: '_slider_left',
		SLIDER_RIGHT: '_slider_right',
		// offers sliders
		SLIDER_CONT_OF_ID: '_slider_cont_',
		SLIDER_LIST_OF_ID: '_slider_list_',
		SLIDER_LEFT_OF_ID: '_slider_left_',
		SLIDER_RIGHT_OF_ID: '_slider_right_',
		// offers sliders mobile
		SLIDER_CONT_OFM_ID: '_sliderm_cont_',
		SLIDER_LIST_OFM_ID: '_sliderm_list_',
		SLIDER_LEFT_OFM_ID: '_sliderm_left_',
		SLIDER_RIGHT_OFM_ID: '_sliderm_right_',
		// offers
		TREE_ID: '_skudiv',
		TREE_ITEM_ID: '_prop_',
		DISPLAY_PROP_DIV: '_sku_prop',
		DISPLAY_PROP_ARTICLE_DIV: '_sku_article_prop',
		// quantity
		QUANTITY_ID: '_quantity',
		QUANTITY_UP_ID: '_quant_up',
		QUANTITY_DOWN_ID: '_quant_down',
		QUANTITY_MEASURE: '_quant_measure',
		QUANTITY_LIMIT: '_quant_limit',
		BASIS_PRICE: '_basis_price',
		// price and discount
		PRICE_ID: '_price',
		OLD_PRICE_ID: '_old_price',
		DISCOUNT_VALUE_ID: '_price_discount',
		DISCOUNT_PERC_ID: '_dsc_pict',
		// basket
		BASKET_PROP_DIV: '_basket_prop',
		BUY_ID: '_buy_link',
		BASKET_LINK: '_basket_link',
		ADD_BASKET_ID: '_add_basket_link',
		BASKET_ACTIONS_ID: '_basket_actions',
		NOT_AVAILABLE_MESS: '_not_avail',
		SUBSCRIBE_ID: '_subscribe_div',
		SUBSCRIBED_ID: '_subscribed_div',
		// magnifier
		MAGNIFIER_ID: '_magnifier',
		MAGNIFIER_AREA_ID: '_magnifier_area',
		// offer groups
		OFFER_GROUP: '_set_group_',
		// compare
		COMPARE_LINK_ID: '_compare_link'
	};

	this.visual = {};

	this.basketMode = '';
	this.product = {
		checkQuantity: false,
		maxQuantity: 0,
		stepQuantity: 1,
		startQuantity: 1,
		isDblQuantity: false,
		canBuy: true,
		canSubscription: true,
		name: '',
		pict: {},
		id: 0,
		addUrl: '',
		buyUrl: '',
		slider: {},
		sliderCount: 0,
		useSlider: false,
		sliderPict: []
	};
	this.mess = {};

	this.basketData = {
		useProps: false,
		emptyProps: false,
		quantity: 'quantity',
		props: 'prop',
		basketUrl: '',
		sku_props: '',
		sku_props_var: 'basket_props',
		add_url: '',
		buy_url: ''
	};
	this.compareData = {
		compareUrl: '',
		comparePath: ''
	};

	this.defaultPict = {
		preview: null,
		detail: null
	};

	this.offers = [];
	this.offerNum = 0;
	this.treeProps = [];
	this.obTreeRows = [];
	this.showCount = [];
	this.showStart = [];
	this.selectedValues = {};
	this.sliders = [];

	this.obProduct = null;
	this.obQuantity = null;
	this.obQuantityUp = null;
	this.obQuantityDown = null;
	this.obBasisPrice = null;
	this.obPict = null;
	this.obPictAligner = null;
	this.obPrice = {
		price: null,
		full: null,
		discount: null,
		percent: null
	};
	this.obTree = null;
	this.obBuyBtn = null;
	this.obBasketBtn = null;
	this.obAddToBasketBtn = null;
	this.obBasketActions = null;
	this.obNotAvail = null;
	this.obSkuProps = null;
	this.obSlider = null;
	this.obMeasure = null;
	this.obQuantityLimit = {
		all: null,
		value: null
	};
	this.obCompare = null;

	this.viewedCounter = {
		path: '/bitrix/components/bitrix/catalog.element/ajax.php',
		params: {
			AJAX: 'Y',
			SITE_ID: '',
			PRODUCT_ID: 0,
			PARENT_ID: 0
		}
	};

	this.currentImg = {
		src: '',
		width: 0,
		height: 0,
		screenWidth: 0,
		screenHeight: 0,
		screenOffsetX: 0,
		screenOffsetY: 0,
		scale: 1
	};
	this.currentBigImg = {
		src: '',
	}

	this.obPopupWin = null;
	this.basketUrl = '';
	this.basketParams = {};

	this.obPopupPict = null;
	this.magnify = {
		obMagnifier: null,
		obMagnifyPict: null,
		obMagnifyArea: null,
		obBigImg: null,
		obBigSlider: null,
		magnifyShow: false,
		areaParams : {
			width: 100,
			height: 130,
			left: 0,
			top: 0,
			scaleFactor: 1,
			globalLeft: 0,
			globalTop: 0,
			globalRight: 0,
			globalBottom: 0
		},
		magnifierParams: {
			top: 0,
			left: 0,
			width: 0,
			height: 0,
			ratioX: 10,
			ratioY: 13,
			defaultScale: 1
		},
		magnifyPictParams: {
			marginTop: 0,
			marginLeft: 0,
			width: 0,
			height: 0
		}
	};

	this.treeRowShowSize = 5;
	this.treeEnableArrow = { display: '', cursor: 'pointer', opacity: 1 };
	this.treeDisableArrow = { display: '', cursor: 'default', opacity: 0.2 };
	this.sliderRowShowSize = 5;
	this.sliderEnableArrow = { display: '', cursor: 'pointer', opacity: 1 };
	this.sliderDisableArrow = { display: '', cursor: 'default', opacity: 0.2 };

	this.errorCode = 0;
	if (typeof arParams === 'object')
	{
		this.params = arParams;
		this.initConfig();

		if (!!this.params.MESS)
		{
			this.mess = this.params.MESS;
		}
		switch (this.productType)
		{
			case 0:// no catalog
			case 1://product
			case 2://set
				this.initProductData();
				break;
			case 3://sku
				this.initOffersData();
				break;
			default:
				this.errorCode = -1;
		}

		this.initBasketData();
		this.initCompareData();
	}
	if (0 === this.errorCode)
	{
		BX.ready(BX.delegate(this.Init,this));
	}
	this.params = {};
};

window.JCCatalogElement.prototype.Init = function()
{
	var i = 0,
		j = 0,
		strPrefix = '',
		SliderImgs = null,
		TreeItems = null;

	this.obProduct = BX(this.visual.ID);
	if (!this.obProduct)
	{
		this.errorCode = -1;
	}
	this.obPict = BX(this.visual.PICT_ID);
	if (!this.obPict)
	{
		this.errorCode = -2;
	}
	else
	{
		this.obPictAligner = this.obPict.parentNode;
	}

	if (this.config.showPrice)
	{
		this.obPrice.price = BX(this.visual.PRICE_ID);
		if (!this.obPrice.price && this.config.useCatalog)
		{
			this.errorCode = -16;
		}
		else
		{
			if (this.config.showOldPrice)
			{
				this.obPrice.full = BX(this.visual.OLD_PRICE_ID);
				this.obPrice.discount = BX(this.visual.DISCOUNT_VALUE_ID);
				/*if (!this.obPrice.full || !this.obPrice.discount)
				{
					this.config.showOldPrice = false;
				}*/
			}
			if (this.config.showPercent)
			{
				this.obPrice.percent = BX(this.visual.DISCOUNT_PERC_ID);
				/*if (!this.obPrice.percent)
				{
					this.config.showPercent = false;
				}*/
			}
		}
		this.obBasketActions = BX(this.visual.BASKET_ACTIONS_ID);
		if (!!this.obBasketActions)
		{
			if (BX.util.in_array('BUY', this.config.basketAction))
			{
				this.obBuyBtn = BX(this.visual.BUY_ID);
			}
			if (BX.util.in_array('ADD', this.config.basketAction))
			{
				this.obAddToBasketBtn = BX(this.visual.BUY_ID);
			}
			if (!!this.visual.BASKET_LINK)
			{
				this.obBasketBtn = BX(this.visual.BASKET_LINK);
			}

		}
		this.obNotAvail = BX(this.visual.NOT_AVAILABLE_MESS);
	}

	if (this.config.showQuantity)
	{
		this.obQuantity = BX(this.visual.QUANTITY_ID);
		if (!!this.visual.QUANTITY_UP_ID)
		{
			this.obQuantityUp = BX(this.visual.QUANTITY_UP_ID);
		}
		if (!!this.visual.QUANTITY_DOWN_ID)
		{
			this.obQuantityDown = BX(this.visual.QUANTITY_DOWN_ID);
		}
		if (this.config.showBasisPrice)
		{
			this.obBasisPrice = BX(this.visual.BASIS_PRICE);
		}
	}
	if (3 === this.productType)
	{
		if (!!this.visual.TREE_ID)
		{
			this.obTree = BX(this.visual.TREE_ID);
			if (!this.obTree)
			{
				this.errorCode = -256;
			}
			strPrefix = this.visual.TREE_ITEM_ID;
			for (i = 0; i < this.treeProps.length; i++)
			{
				this.obTreeRows[i] = {
					LEFT: BX(strPrefix+this.treeProps[i].ID+'_left'),
					RIGHT: BX(strPrefix+this.treeProps[i].ID+'_right'),
					LIST: BX(strPrefix+this.treeProps[i].ID+'_list'),
					CONT: BX(strPrefix+this.treeProps[i].ID+'_cont')
				};
				if (!this.obTreeRows[i].LIST || !this.obTreeRows[i].CONT)
				{
					this.errorCode = -512;
					break;
				}
			}
		}
		if (!!this.visual.QUANTITY_MEASURE)
		{
			this.obMeasure = BX(this.visual.QUANTITY_MEASURE);
		}
		if (!!this.visual.QUANTITY_LIMIT)
		{
			this.obQuantityLimit.all = BX(this.visual.QUANTITY_LIMIT);
			if (!!this.obQuantityLimit.all)
			{
				this.obQuantityLimit.value = BX.findChild(this.obQuantityLimit.all, {tagName: 'span'}, false, false);
				if (!this.obQuantityLimit.value)
				{
					this.obQuantityLimit.all = null;
				}
			}
		}
	}

	if (this.config.showSkuProps)
	{
		if (!!this.visual.DISPLAY_PROP_DIV)
		{
			this.obSkuProps = BX(this.visual.DISPLAY_PROP_DIV);
		}
		if (!!this.visual.DISPLAY_PROP_ARTICLE_DIV)
		{
			this.obSkuArticleProps = BX(this.visual.DISPLAY_PROP_ARTICLE_DIV);
		}

	}

	if (this.config.useCompare)
	{
		this.obCompare = BX(this.visual.COMPARE_LINK_ID);
	}
	if (0 === this.errorCode)
	{

		if (this.config.showQuantity)
		{
			if (!!this.obQuantityUp)
			{
				BX.bind(this.obQuantityUp, 'click', BX.delegate(this.QuantityUp, this));
			}
			if (!!this.obQuantityDown)
			{
				BX.bind(this.obQuantityDown, 'click', BX.delegate(this.QuantityDown, this));
			}
			if (!!this.obQuantity)
			{
				BX.bind(this.obQuantity, 'change', BX.delegate(this.QuantityChange, this));
			}
		}
		switch (this.productType)
		{
			case 0://no catalog
			case 1://product
			case 2://set
				if (this.product.useSlider)
				{
					this.product.slider = {
						COUNT: this.product.sliderCount,
						ID: this.visual.SLIDER_CONT,
						CONT: BX(this.visual.SLIDER_CONT),
						LIST: BX(this.visual.SLIDER_LIST),
						LEFT: BX(this.visual.SLIDER_LEFT),
						RIGHT: BX(this.visual.SLIDER_RIGHT),
						START: 0
					};
					SliderImgs = BX.findChildren(this.product.slider.LIST, {tagName: 'li'}, true);
					if (!!SliderImgs && 0 < SliderImgs.length)
					{
						for (j = 0; j < SliderImgs.length; j++)
						{
							BX.bind(SliderImgs[j], 'click', BX.delegate(this.ProductSelectSliderImg, this));
						}
					}
					if (!!this.product.slider.LEFT)
					{
						BX.bind(this.product.slider.LEFT, 'click', BX.delegate(this.ProductSliderRowLeft, this));
						BX.adjust(this.product.slider.LEFT, { style: this.sliderDisableArrow } );

					}
					if (!!this.product.slider.RIGHT)
					{
						BX.bind(this.product.slider.RIGHT, 'click', BX.delegate(this.ProductSliderRowRight, this));
						BX.adjust(this.product.slider.RIGHT, { style: this.sliderEnableArrow } );
					}
					this.setCurrentImg(this.product.sliderPict[0], true);
				}
				break;
			case 3://sku
				for(var key in this.skuVisualParams){
					var TreeItems = BX.findChildren(this.obTree, {tagName: this.skuVisualParams[key].TAG_BIND}, true);
					if (!!TreeItems && 0 < TreeItems.length){
						for (i = 0; i < TreeItems.length; i++){
							$(TreeItems[i]).on(this.skuVisualParams[key].EVENT, BX.delegate(this.SelectOfferProp, this));
							//BX.bind(TreeItems[i], this.skuVisualParams[key].EVENT, BX.delegate(this.SelectOfferProp, this));
						}
					}
				}
				for (i = 0; i < this.offers.length; i++)
				{
					this.offers[i].SLIDER_COUNT = parseInt(this.offers[i].SLIDER_COUNT, 10);
					if (isNaN(this.offers[i].SLIDER_COUNT))
					{
						this.offers[i].SLIDER_COUNT = 0;
					}
					if (0 === this.offers[i].SLIDER_COUNT)
					{
						this.sliders[i] = {
							COUNT: this.offers[i].SLIDER_COUNT,
							ID: ''
						};
					}
					else
					{
						for (j = 0; j < this.offers[i].SLIDER.length; j++)
						{
							this.offers[i].SLIDER[j].WIDTH = parseInt(this.offers[i].SLIDER[j].WIDTH, 10);
							this.offers[i].SLIDER[j].HEIGHT = parseInt(this.offers[i].SLIDER[j].HEIGHT, 10);
						}
						this.sliders[i] = {
							COUNT: this.offers[i].SLIDER_COUNT,
							OFFER_ID: this.offers[i].ID,
							ID: this.visual.SLIDER_CONT_OF_ID+this.offers[i].ID,
							CONT: BX(this.visual.SLIDER_CONT_OF_ID+this.offers[i].ID),
							LIST: BX(this.visual.SLIDER_LIST_OF_ID+this.offers[i].ID),
							CONT_M: BX(this.visual.SLIDER_CONT_OFM_ID+this.offers[i].ID),
							LIST_M: BX(this.visual.SLIDER_LIST_OFM_ID+this.offers[i].ID),
							LEFT: BX(this.visual.SLIDER_LEFT_OF_ID+this.offers[i].ID),
							RIGHT: BX(this.visual.SLIDER_RIGHT_OF_ID+this.offers[i].ID),
							START: 0
						};
						SliderImgs = BX.findChildren(this.sliders[i].LIST, {tagName: 'li'}, true);
						if (!!SliderImgs && 0 < SliderImgs.length)
						{
							for (j = 0; j < SliderImgs.length; j++)
							{
								BX.bind(SliderImgs[j], 'click', BX.delegate(this.SelectSliderImg, this));
							}
						}
						if (!!this.sliders[i].LEFT)
						{
							BX.bind(this.sliders[i].LEFT, 'click', BX.delegate(this.SliderRowLeft, this));
						}
						if (!!this.sliders[i].RIGHT)
						{
							BX.bind(this.sliders[i].RIGHT, 'click', BX.delegate(this.SliderRowRight, this));
						}
					}
				}
				this.SetCurrent();

				break;
		}

		if (!!this.obBuyBtn)
		{
			BX.bind(this.obBuyBtn, 'click', BX.proxy(this.BuyBasket, this));
		}
		if (!!this.obAddToBasketBtn)
		{
			BX.bind(this.obAddToBasketBtn, 'click', BX.proxy(this.Add2Basket, this));
		}
		if (!!this.obCompare)
		{
			BX.bind(this.obCompare, 'click', BX.proxy(this.Compare, this));
		}

		this.setMainPictHandler();
		setTimeout(function(){
			$('.offers_img.wof').css('opacity', 1);
		},400);
	}
};

window.JCCatalogElement.prototype.initConfig = function()
{
	this.productType = parseInt(this.params.PRODUCT_TYPE, 10);
	if (!!this.params.CONFIG && typeof(this.params.CONFIG) === 'object')
	{
		if (this.params.CONFIG.USE_CATALOG !== 'undefined' && BX.type.isBoolean(this.params.CONFIG.USE_CATALOG))
		{
			this.config.useCatalog = this.params.CONFIG.USE_CATALOG;
		}
		this.config.showQuantity = !!this.params.CONFIG.SHOW_QUANTITY;
		this.config.showPrice = !!this.params.CONFIG.SHOW_PRICE;
		this.config.showPercent = !!this.params.CONFIG.SHOW_DISCOUNT_PERCENT;
		this.config.showOldPrice = !!this.params.CONFIG.SHOW_OLD_PRICE;
		this.config.showSkuProps = !!this.params.CONFIG.SHOW_SKU_PROPS;
		this.config.showOfferGroup = !!this.params.CONFIG.OFFER_GROUP;
		this.config.useCompare = !!this.params.CONFIG.DISPLAY_COMPARE;
		if (!!this.params.CONFIG.MAIN_PICTURE_MODE)
		{
			this.config.mainPictureMode = this.params.CONFIG.MAIN_PICTURE_MODE;
		}
		this.config.showBasisPrice = !!this.params.CONFIG.SHOW_BASIS_PRICE;
		if (!!this.params.CONFIG.ADD_TO_BASKET_ACTION)
		{
			this.config.basketAction = this.params.CONFIG.ADD_TO_BASKET_ACTION;
		}
		this.config.showClosePopup = !!this.params.CONFIG.SHOW_CLOSE_POPUP;
	}
	else
	{
		// old version
		if (this.params.USE_CATALOG !== 'undefined' && BX.type.isBoolean(this.params.USE_CATALOG))
		{
			this.config.useCatalog = this.params.USE_CATALOG;
		}
		this.config.showQuantity = !!this.params.SHOW_QUANTITY;
		this.config.showPrice = !!this.params.SHOW_PRICE;
		this.config.showPercent = !!this.params.SHOW_DISCOUNT_PERCENT;
		this.config.showOldPrice = !!this.params.SHOW_OLD_PRICE;
		this.config.showSkuProps = !!this.params.SHOW_SKU_PROPS;
		this.config.showOfferGroup = !!this.params.OFFER_GROUP;
		this.config.useCompare = !!this.params.DISPLAY_COMPARE;
		if (!!this.params.MAIN_PICTURE_MODE)
		{
			this.config.mainPictureMode = this.params.MAIN_PICTURE_MODE;
		}
		this.config.showBasisPrice = !!this.params.SHOW_BASIS_PRICE;
		if (!!this.params.ADD_TO_BASKET_ACTION)
		{
			this.config.basketAction = this.params.ADD_TO_BASKET_ACTION;
		}
		this.config.showClosePopup = !!this.params.SHOW_CLOSE_POPUP;
	}

	if (!this.params.VISUAL || typeof(this.params.VISUAL) !== 'object' || !this.params.VISUAL.ID)
	{
		this.errorCode = -1;
		return;
	}
	this.visual.ID = this.params.VISUAL.ID;
	this.basketLinkURL = this.params.BASKET.BASKET_URL;
	this.defaultCount = this.params.DEFAULT_COUNT;
	this.storeQuanity = BX(this.params.STORE_QUANTITY);
	this.initVisualParams('main');
	if (this.config.showQuantity)
	{
		this.initVisualParams('quantity');
	}
	if (this.config.showPrice)
	{
		this.initVisualParams('price');
	}
	if (this.config.showOldPrice)
	{
		this.initVisualParams('oldPrice');
	}
	if (this.config.showPercent)
	{
		this.initVisualParams('discountPerc');
	}
	this.initVisualParams('basket');
	if (this.config.mainPictureMode === 'MAGNIFIER')
	{
		this.initVisualParams('magnifier');
	}
	if (this.config.useCompare)
	{
		this.initVisualParams('compare');
	}
};

window.JCCatalogElement.prototype.initVisualParams = function(ID)
{
	var i = 0,
		key = '';

	if (!this.listID[ID])
	{
		this.errorCode = -1;
		return;
	}
	for (i = 0; i < this.listID[ID].length; i++)
	{
		key = this.listID[ID][i];
		this.visual[key] = (!!this.params.VISUAL[key] ? this.params.VISUAL[key] : this.visual.ID+this.visualPostfix[key]);
	}
};

window.JCCatalogElement.prototype.initProductData = function()
{
	var j = 0;
	this.initVisualParams('productSlider');
	if (!!this.params.PRODUCT && 'object' === typeof(this.params.PRODUCT))
	{
		if (this.config.showQuantity)
		{
			this.product.checkQuantity = this.params.PRODUCT.CHECK_QUANTITY;
			this.product.isDblQuantity = this.params.PRODUCT.QUANTITY_FLOAT;
			if (this.product.checkQuantity)
			{
				this.product.maxQuantity = (this.product.isDblQuantity ? parseFloat(this.params.PRODUCT.MAX_QUANTITY) : parseInt(this.params.PRODUCT.MAX_QUANTITY, 10));
			}
			this.product.stepQuantity = (this.product.isDblQuantity ? parseFloat(this.params.PRODUCT.STEP_QUANTITY) : parseInt(this.params.PRODUCT.STEP_QUANTITY, 10));

			this.checkQuantity = this.product.checkQuantity;
			this.isDblQuantity = this.product.isDblQuantity;
			this.maxQuantity = this.product.maxQuantity;
			this.stepQuantity = this.product.stepQuantity;
			if (this.isDblQuantity)
			{
				this.stepQuantity = Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor;
			}
		}
		this.product.canBuy = this.params.PRODUCT.CAN_BUY;
		this.product.canSubscription = this.params.PRODUCT.SUBSCRIPTION;
		if (this.config.showPrice)
		{
			this.currentBasisPrice = this.params.PRODUCT.BASIS_PRICE;
		}

		this.canBuy = this.product.canBuy;
		this.canSubscription = this.product.canSubscription;

		this.product.name = this.params.PRODUCT.NAME;
		this.product.pict = this.params.PRODUCT.PICT;
		this.product.id = this.params.PRODUCT.ID;

		if (!!this.params.PRODUCT.ADD_URL)
		{
			this.product.addUrl = this.params.PRODUCT.ADD_URL;
		}
		if (!!this.params.PRODUCT.BUY_URL)
		{
			this.product.buyUrl = this.params.PRODUCT.BUY_URL;
		}

		if (!!this.params.PRODUCT.SLIDER_COUNT)
		{
			this.product.sliderCount = parseInt(this.params.PRODUCT.SLIDER_COUNT, 10);
			if (isNaN(this.product.sliderCount))
			{
				this.product.sliderCount = 0;
			}
			if (0 < this.product.sliderCount && !!this.params.PRODUCT.SLIDER.length && 0 < this.params.PRODUCT.SLIDER.length)
			{
				for (j = 0; j < this.params.PRODUCT.SLIDER.length; j++)
				{
					this.product.useSlider = true;
					this.params.PRODUCT.SLIDER[j].WIDTH = parseInt(this.params.PRODUCT.SLIDER[j].WIDTH, 10);
					this.params.PRODUCT.SLIDER[j].HEIGHT = parseInt(this.params.PRODUCT.SLIDER[j].HEIGHT, 10);
				}
				this.product.sliderPict = this.params.PRODUCT.SLIDER;
				this.setCurrentImg(this.product.sliderPict[0], false);
			}
		}
		this.currentIsSet = true;
	}
	else
	{
		this.errorCode = -1;
	}
};

window.JCCatalogElement.prototype.initOffersData = function()
{
	this.initVisualParams('offerSlider');
	this.initVisualParams('offerSliderMobile');
	this.initVisualParams('offers');
	if (!!this.params.OFFERS && BX.type.isArray(this.params.OFFERS))
	{
		this.offers = this.params.OFFERS;
		this.offerNum = 0;
		if (!!this.params.OFFER_SELECTED)
		{
			this.offerNum = parseInt(this.params.OFFER_SELECTED, 10);
		}
		if (isNaN(this.offerNum))
		{
			this.offerNum = 0;
		}
		if (!!this.params.TREE_PROPS)
		{
			this.treeProps = this.params.TREE_PROPS;
		}
		if (!!this.params.DEFAULT_PICTURE)
		{
			this.defaultPict.preview = this.params.DEFAULT_PICTURE.PREVIEW_PICTIRE;
			this.defaultPict.detail = this.params.DEFAULT_PICTURE.DETAIL_PICTURE;
		}
		if (!!this.params.PRODUCT && typeof(this.params.PRODUCT) === 'object')
		{
			this.product.id = parseInt(this.params.PRODUCT.ID, 10);
			this.product.name = this.params.PRODUCT.NAME;
		}
	}
	else
	{
		this.errorCode = -1;
	}
};

window.JCCatalogElement.prototype.initBasketData = function()
{
	if (!!this.params.BASKET && 'object' === typeof(this.params.BASKET))
	{
		if (1 === this.productType || 2 === this.productType)
		{
			this.basketData.useProps = !!this.params.BASKET.ADD_PROPS;
			this.basketData.emptyProps = !!this.params.BASKET.EMPTY_PROPS;
		}

		if (!!this.params.BASKET.QUANTITY)
		{
			this.basketData.quantity = this.params.BASKET.QUANTITY;
		}
		if (!!this.params.BASKET.PROPS)
		{
			this.basketData.props = this.params.BASKET.PROPS;
		}
		if (!!this.params.BASKET.BASKET_URL)
		{
			this.basketData.basketUrl = this.params.BASKET.BASKET_URL;
		}
		if (3 === this.productType)
		{
			if (!!this.params.BASKET.SKU_PROPS)
			{
				this.basketData.sku_props = this.params.BASKET.SKU_PROPS;
			}
		}
		if (!!this.params.BASKET.ADD_URL_TEMPLATE)
		{
			this.basketData.add_url = this.params.BASKET.ADD_URL_TEMPLATE;
		}
		if (!!this.params.BASKET.BUY_URL_TEMPLATE)
		{
			this.basketData.buy_url = this.params.BASKET.BUY_URL_TEMPLATE;
		}
		if (this.basketData.add_url === '' && this.basketData.buy_url === '')
		{
			this.errorCode = -1024;
		}
	}
};

window.JCCatalogElement.prototype.initCompareData = function()
{
	if (this.config.useCompare)
	{
		if (!!this.params.COMPARE && typeof(this.params.COMPARE) === 'object')
		{
			if (!!this.params.COMPARE.COMPARE_PATH)
			{
				this.compareData.comparePath = this.params.COMPARE.COMPARE_PATH;
			}
			if (!!this.params.COMPARE.COMPARE_URL_TEMPLATE_DEL)
			{
				this.compareData.compareUrlDel = this.params.COMPARE.COMPARE_URL_TEMPLATE_DEL;
			}
			if (!!this.params.COMPARE.COMPARE_URL_TEMPLATE)
			{
				this.compareData.compareUrl = this.params.COMPARE.COMPARE_URL_TEMPLATE;
			}
			else
			{
				this.config.useCompare = false;
			}
		}
		else
		{
			this.config.useCompare = false;
		}
	}
};

window.JCCatalogElement.prototype.setMainPictHandler = function()
{
	switch (this.config.mainPictureMode)
	{
		case 'GALLERY':
			break;
		case 'MAGNIFIER':
			this.magnify.obBigImg = BX(this.visual.BIG_IMG_CONT_ID);
			this.magnify.obBigSlider = BX(this.visual.BIG_SLIDER_ID);
			if (!!this.magnify.obBigImg && !!this.magnify.obBigSlider)
			{
				this.magnify.obMagnifyArea = this.obPictAligner.appendChild(BX.create(
					'DIV',
					{
						props: {
							id: this.visual.MAGNIFIER_AREA_ID,
							className: 'bx_item_slider_lupe_small'
						},
						style: {
							display: 'none',
							top: 0,
							left: 0,
							width: '100px',
							height: '130px'
						},
						events: {
							mouseover: BX.delegate(this.onMagnifierArea, this),
							mouseout: BX.delegate(function(){this.outMagnifierArea(); this.hideMagnifier(); }, this)
						}
					}
				));

				this.magnify.obMagnifier = this.magnify.obBigSlider.appendChild(BX.create(
					'DIV',
					{
						props: {
							id: this.visual.MAGNIFIER_ID,
							className: 'bx_item_slider_lupe'
						},
						style: {
							display: 'none'
						}
					}
				));
				this.magnify.obMagnifyPict = this.magnify.obMagnifier.appendChild(BX.create(
					'IMG',
					{
						props: {
							src: this.currentImg.src
						}
					}
				));
				BX.bind(this.obPict, 'mouseover', BX.delegate(this.showMagnifier, this));
			}
			break;
		case 'POPUP':
			this.obPopupPict = new BX.PopupWindow('CatalogElementPopup_'+this.visual.ID, null, {
				autoHide: false,
				offsetLeft: 0,
				offsetTop: 0,
				overlay : false,
				closeByEsc: true,
				titleBar: true,
				closeIcon: {top: '10px', right: '10px'}
			});
			BX.bind(this.obPict, 'click', BX.delegate(this.showMainPictPopup, this));
			BX.adjust(this.obPict, { style: { cursor: 'pointer' } });
			BX.addCustomEvent(this.obPopupPict, "onAfterPopupShow", BX.proxy(this.onPopupWindowShow, this));
			BX.addCustomEvent(this.obPopupPict, "onPopupClose", BX.proxy(this.onPopupWindowClose, this));
			break;
		default:
			break;
	}
};

window.JCCatalogElement.prototype.setCurrentImg = function(img, showImage)
{
	showImage = !!showImage;
	if('SMALL' in img){
		this.currentImg.src = img.SMALL.src;
	}else if ('SRC' in img) {
		this.currentImg.src = img.SRC
	};
	if('BIG' in img){
		this.currentBigImg.src = img.BIG.src;
	}
	if('WIDTH' in img){
		this.currentImg.width = img.WIDTH;
	}
	if('HEIGHT' in img){
		this.currentImg.height = img.HEIGHT;
	}
	if (showImage && !!this.obPict)
	{
		if (this.config.mainPictureMode === 'MAGNIFIER')
		{
			this.outMagnifierArea();
			this.hideMagnifier();
		}
		if('src' in this.currentImg){
			if (this.currentImg.src){
				BX.adjust(this.obPict, { props: { src: this.currentImg.src } });
			}
		}
		if('src' in this.currentBigImg){
			if (this.currentBigImg.src){
				$(this.obPict).parent().attr('href',this.currentBigImg.src);
				$(this.obPict).parent().attr('title',img.TITLE);
				$(this.obPict).parent().attr('alt',img.ALT);
				$(this.obPict).attr('title',img.TITLE);
				$(this.obPict).attr('alt',img.ALT);				
			}
		}

		var dest = {
				width: parseInt(this.obPictAligner.offsetWidth, 10),
				height: parseInt(this.obPictAligner.offsetHeight, 10)
			},
			result,
			newMarginTop;
		//result = this.scaleImg(this.currentImg, dest);

		/*newMarginTop = (result.height < dest.height ? (dest.height - result.height) >>> 1 : 0);
		if (newMarginTop !== this.currentImg.screenOffsetY)
		{
			BX.style(this.obPictAligner, 'marginTop', newMarginTop+'px');
			this.currentImg.screenOffsetY = newMarginTop;
		}
		this.currentImg.screenOffsetX = (result.width < dest.width ? (dest.width - result.width) >>> 1 : 0);
		this.currentImg.screenWidth = result.width;
		this.currentImg.screenHeight = result.height;*/
	}
};

window.JCCatalogElement.prototype.scaleImg = function(src, dest)
{
	var
		scaleX,
		scaleY,
		scale,
		result = {};

	if (dest.width >= src.width && dest.height >= src.height)
	{
		result.width = src.width;
		result.height = src.height;
	}
	else
	{
		scaleX = dest.width/src.width;
		scaleY = dest.height/src.height;
		scale =  Math.min(scaleX, scaleY);
		result.width = Math.max(1, parseInt(scale*src.width , 10));
		result.height = Math.max(1, parseInt(scale*src.height , 10));
	}
	return result;
};

window.JCCatalogElement.prototype.showMagnifier = function(e)
{
	if (!this.magnify.magnifyShow)
	{
		this.calcMagnifierParams();
		this.calcMagnifyAreaSize();
		this.calcMagnifyAreaPos(e);
		this.calcMagnifyPictSize();
		this.calcMagnifyPictPos();
		this.setMagnifyAreaParams(true);
		this.setMagnifyPictParams(true);
		this.setMagnifierParams(true);
		BX.bind(document, 'mousemove', BX.proxy(this.moveMagnifierArea, this));
	}
};

window.JCCatalogElement.prototype.hideMagnifier = function()
{
	if (!this.magnify.magnifyShow)
	{
		if (!!this.magnify.obMagnifier)
		{
			BX.adjust(this.magnify.obMagnifier, { style: { display: 'none' } });
		}
		if (!!this.magnify.obMagnifyArea)
		{
			BX.adjust(this.magnify.obMagnifyArea, { style: { display: 'none' } });
		}
		BX.unbind(document, 'mousemove', BX.proxy(this.moveMagnifierArea, this));
	}
};

window.JCCatalogElement.prototype.moveMagnifierArea = function(e)
{
	var
		currentPos = {
			X: 0,
			Y: 0
		},
		posBigImg = BX.pos(this.obPict),
		intersect = {},
		params = {},
		paramsPict = {};

	currentPos = this.inRect(e, posBigImg);
	if (this.inBound(posBigImg, currentPos))
	{
		intersect = this.intersectArea(currentPos, posBigImg);
		switch (intersect.X)
		{
			case -1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX;
				break;
			case 0:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + currentPos.X - (this.magnify.areaParams.width >>> 1);
				break;
			case 1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + posBigImg.width - this.magnify.areaParams.width;
				break;
		}
		switch (intersect.Y)
		{
			case -1:
				this.magnify.areaParams.top = 0;
				break;
			case 0:
				this.magnify.areaParams.top = currentPos.Y - (this.magnify.areaParams.height >>> 1);
				break;
			case 1:
				this.magnify.areaParams.top = posBigImg.height - this.magnify.areaParams.height;
				break;
		}
		this.magnify.magnifyPictParams.marginLeft = -parseInt(((this.magnify.areaParams.left-this.currentImg.screenOffsetX)*this.currentImg.scale), 10);
		this.magnify.magnifyPictParams.marginTop = -parseInt(((this.magnify.areaParams.top)*this.currentImg.scale), 10);
		params.left = this.magnify.areaParams.left+'px';
		params.top = this.magnify.areaParams.top+'px';
		BX.adjust(this.magnify.obMagnifyArea, { style: params });
		paramsPict.marginLeft = this.magnify.magnifyPictParams.marginLeft+'px';
		paramsPict.marginTop = this.magnify.magnifyPictParams.marginTop+'px';
		BX.adjust(this.magnify.obMagnifyPict, { style: paramsPict });
	}
	else
	{
		this.outMagnifierArea();
		this.hideMagnifier();
	}
};

window.JCCatalogElement.prototype.onMagnifierArea = function()
{
	this.magnify.magnifyShow = true;
};

window.JCCatalogElement.prototype.outMagnifierArea = function()
{
	this.magnify.magnifyShow = false;
};

window.JCCatalogElement.prototype.calcMagnifierParams = function()
{
	if (!!this.magnify.obBigImg)
	{
		var pos = BX.pos(this.magnify.obBigImg, true);

		this.magnify.magnifierParams.width = pos.width;
		this.magnify.magnifierParams.height = pos.height;
		this.magnify.magnifierParams.top = pos.top;
		this.magnify.magnifierParams.left = pos.left + pos.width + 2;
	}
};

window.JCCatalogElement.prototype.setMagnifierParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			top: this.magnify.magnifierParams.top+'px',
			left: this.magnify.magnifierParams.left+'px',
			width: this.magnify.magnifierParams.width+'px',
			height: this.magnify.magnifierParams.height+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifier, { style: params });
	}
};

window.JCCatalogElement.prototype.setMagnifyAreaParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			top: this.magnify.areaParams.top+'px',
			left: this.magnify.areaParams.left+'px',
			width: this.magnify.areaParams.width+'px',
			height: this.magnify.areaParams.height+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifyArea, { style: params });
	}
};

window.JCCatalogElement.prototype.calcMagnifyAreaPos = function(e)
{
	var currentPos,
		posBigImg,
		intersect;

	posBigImg = BX.pos(this.obPict);
	currentPos = this.inRect(e, posBigImg);
	if (this.inBound(posBigImg, currentPos))
	{
		intersect = this.intersectArea(currentPos, posBigImg);
		switch (intersect.X)
		{
			case -1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX;
				break;
			case 0:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + currentPos.X - (this.magnify.areaParams.width >>> 1);
				break;
			case 1:
				this.magnify.areaParams.left = this.currentImg.screenOffsetX + posBigImg.width - this.magnify.areaParams.width;
				break;
		}
		switch (intersect.Y)
		{
			case -1:
				this.magnify.areaParams.top = 0;
				break;
			case 0:
				this.magnify.areaParams.top = currentPos.Y - (this.magnify.areaParams.height >>> 1);
				break;
			case 1:
				this.magnify.areaParams.top = posBigImg.height - this.magnify.areaParams.height;
				break;
		}
	}
};

window.JCCatalogElement.prototype.inBound = function(rect, point)
{
	return ((0 <= point.Y && rect.height >= point.Y) && (0 <= point.X && rect.width >= point.X));
};

window.JCCatalogElement.prototype.inRect = function(e, rect)
{
	var wndSize = BX.GetWindowSize(),
		currentPos = {
			X: 0,
			Y: 0,
			globalX: 0,
			globalY: 0
		};

	currentPos.globalX = e.clientX + wndSize.scrollLeft;
	currentPos.X = currentPos.globalX - rect.left;
	currentPos.globalY = e.clientY + wndSize.scrollTop;
	currentPos.Y = currentPos.globalY - rect.top;
	return currentPos;
};

window.JCCatalogElement.prototype.intersectArea = function(currentPos, rect)
{
	var intersect = {
			X: 0,
			Y: 0
		},
		halfX = this.magnify.areaParams.width >>> 1,
		halfY = this.magnify.areaParams.height >>> 1;

	if (currentPos.X <= halfX)
	{
		intersect.X = -1;
	}
	else if (currentPos.X >= (rect.width - halfX))
	{
		intersect.X = 1;
	}
	else
	{
		intersect.X = 0;
	}
	if (currentPos.Y <= halfY)
	{
		intersect.Y = -1;
	}
	else if (currentPos.Y >= (rect.height - halfY))
	{
		intersect.Y = 1;
	}
	else
	{
		intersect.Y = 0;
	}

	return intersect;
};

window.JCCatalogElement.prototype.calcMagnifyAreaSize = function()
{
	var scaleX,
		scaleY,
		scale;

	if (
		this.magnify.magnifierParams.width < this.currentImg.width &&
			this.magnify.magnifierParams.height < this.currentImg.height
		)
	{
		scaleX = this.magnify.obBigImg.offsetWidth/this.currentImg.width;
		scaleY = this.magnify.obBigImg.offsetHeight/this.currentImg.height;
		scale =  Math.min(scaleX, scaleY);
		this.currentImg.scale = 1/scale;
		this.magnify.areaParams.width = Math.max(1, parseInt(scale*this.magnify.magnifierParams.width , 10));
		this.magnify.areaParams.height = Math.max(1, parseInt(scale*this.magnify.magnifierParams.height , 10));
		this.magnify.areaParams.scaleFactor = this.magnify.magnifierParams.defaultScale;
	}
	else
	{
		scaleX = this.obPict.offsetWidth/this.magnify.obBigImg.offsetWidth;
		scaleY = this.obPict.offsetHeight/this.magnify.obBigImg.offsetHeight;
		scale =  Math.min(scaleX, scaleY);
		this.currentImg.scale = 1/scale;
		this.magnify.areaParams.width = Math.max(1, parseInt(scale*this.magnify.magnifierParams.width , 10));
		this.magnify.areaParams.height = Math.max(1, parseInt(scale*this.magnify.magnifierParams.height , 10));

		scaleX = this.magnify.magnifierParams.width/this.currentImg.width;
		scaleY = this.magnify.magnifierParams.height/this.currentImg.height;
		scale = Math.max(scaleX, scaleY);
		this.magnify.areaParams.scaleFactor = scale;
	}
};

window.JCCatalogElement.prototype.calcMagnifyPictSize = function()
{
	this.magnify.magnifyPictParams.width = this.currentImg.width*this.magnify.areaParams.scaleFactor;
	this.magnify.magnifyPictParams.height = this.currentImg.height*this.magnify.areaParams.scaleFactor;
};

window.JCCatalogElement.prototype.calcMagnifyPictPos = function()
{
	this.magnify.magnifyPictParams.marginLeft = -parseInt(((this.magnify.areaParams.left-this.currentImg.screenOffsetX)*this.currentImg.scale), 10);
	this.magnify.magnifyPictParams.marginTop = -parseInt(((this.magnify.areaParams.top)*this.currentImg.scale), 10);
};

window.JCCatalogElement.prototype.setMagnifyPictParams = function(show)
{
	if (!!this.magnify.obMagnifier)
	{
		show = !!show;
		var params = {
			width: this.magnify.magnifyPictParams.width+'px',
			height: this.magnify.magnifyPictParams.height+'px',
			marginTop: this.magnify.magnifyPictParams.marginTop+'px',
			marginLeft: this.magnify.magnifyPictParams.marginLeft+'px'
		};
		if (show)
		{
			params.display = '';
		}
		BX.adjust(this.magnify.obMagnifyPict, { style: params, props: { src: this.currentImg.src } });
	}
};

window.JCCatalogElement.prototype.ProductSliderRowLeft = function()
{
	var target = BX.proxy_context;
	if (!!target)
	{
		if (this.sliderRowShowSize < this.product.slider.COUNT)
		{
			if (0 > this.product.slider.START)
			{
				this.product.slider.START++;
				BX.adjust(this.product.slider.LIST, { style: { marginLeft: this.product.slider.START*20+'%' }});
				BX.adjust(this.product.slider.RIGHT, { style: this.sliderEnableArrow });
			}

			if (0 <= this.product.slider.START)
			{
				BX.adjust(this.product.slider.LEFT, { style: this.sliderDisableArrow });
			}
		}
	}
};

window.JCCatalogElement.prototype.ProductSliderRowRight = function()
{
	var target = BX.proxy_context;
	if (!!target)
	{
		if (this.sliderRowShowSize < this.product.slider.COUNT)
		{
			if ((this.sliderRowShowSize - this.product.slider.START) < this.product.slider.COUNT)
			{
				this.product.slider.START--;
				BX.adjust(this.product.slider.LIST, { style: { marginLeft: this.product.slider.START*20+'%' }});
				BX.adjust(this.product.slider.LEFT, { style: this.sliderEnableArrow } );
			}

			if ((this.sliderRowShowSize - this.product.slider.START) >= this.product.slider.COUNT)
			{
				BX.adjust(this.product.slider.RIGHT, { style: this.sliderDisableArrow } );
			}
		}
	}
};

window.JCCatalogElement.prototype.ProductSelectSliderImg = function()
{
	var strValue = '',
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		this.SetProductMainPict(strValue);
	}
};

window.JCCatalogElement.prototype.SetProductMainPict = function(intPict)
{
	var indexPict = -1,
		i = 0,
		j = 0,
		value = '',
		strValue = '',
		RowItems = null;
	if (0 < this.product.sliderCount)
	{
		for (j = 0; j < this.product.sliderPict.length; j++)
		{
			if (intPict === this.product.sliderPict[j].ID)
			{
				indexPict = j;
				break;
			}
		}
		if (-1 < indexPict)
		{
			if (!!this.product.sliderPict[indexPict])
			{
				this.setCurrentImg(this.product.sliderPict[indexPict], true);
			}
			RowItems = BX.findChildren(this.product.slider.LIST, {tagName: 'li'}, false);
			if (!!RowItems && 0 < RowItems.length)
			{
				strValue = intPict;
				for (i = 0; i < RowItems.length; i++)
				{
					value = RowItems[i].getAttribute('data-value');
					if (value === strValue)
					{
						BX.addClass(RowItems[i], 'active');
					}
					else
					{
						BX.removeClass(RowItems[i], 'active');
					}
				}
			}
		}
	}
};

window.JCCatalogElement.prototype.SliderRowLeft = function()
{
	var strValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		for (i = 0; i < this.sliders.length; i++)
		{
			if (this.sliders[i].OFFER_ID === strValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.sliderRowShowSize < this.sliders[index].COUNT)
		{
			if (0 > this.sliders[index].START)
			{
				this.sliders[index].START++;
				BX.adjust(this.sliders[index].LIST, { style: { marginLeft: this.sliders[index].START*20+'%' }});
				BX.adjust(this.sliders[index].RIGHT, { style: this.sliderEnableArrow });
			}

			if (0 <= this.sliders[index].START)
			{
				BX.adjust(this.sliders[index].LEFT, { style: this.sliderDisableArrow });
			}
		}
	}
};

window.JCCatalogElement.prototype.SliderRowRight = function()
{
	var strValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		for (i = 0; i < this.sliders.length; i++)
		{
			if (this.sliders[i].OFFER_ID === strValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.sliderRowShowSize < this.sliders[index].COUNT)
		{
			if ((this.sliderRowShowSize - this.sliders[index].START) < this.sliders[index].COUNT)
			{
				this.sliders[index].START--;
				BX.adjust(this.sliders[index].LIST, { style: { marginLeft: this.sliders[index].START*20+'%' }});
				BX.adjust(this.sliders[index].LEFT, { style: this.sliderEnableArrow } );
			}

			if ((this.sliderRowShowSize - this.sliders[index].START) >= this.sliders[index].COUNT)
			{
				BX.adjust(this.sliders[index].RIGHT, { style: this.sliderDisableArrow } );
			}
		}
	}
};

window.JCCatalogElement.prototype.SelectSliderImg = function()
{
	var strValue = '',
		arItem = [],
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-value'))
	{
		strValue = target.getAttribute('data-value');
		arItem = strValue.split('_');
		this.SetMainPict(arItem[0], arItem[1]);
	}
};

window.JCCatalogElement.prototype.SetMainPict = function(intSlider, intPict)
{
	var index = -1,
		indexPict = -1,
		i,
		j,
		value = '',
		RowItems = null,
		strValue = '';

	for (i = 0; i < this.offers.length; i++)
	{
		if (intSlider === this.offers[i].ID)
		{
			index = i;
			break;
		}
	}

	$(window).resize();
	$('.thumbs_navigation ul').addClass('hidden_block');
	if(this.SliderImages>1){
		$('.thumbs_navigation ul:eq('+index+')').removeClass('hidden_block');
	}
	$('.thumbs_navigation').removeClass('hidden_block');
	//$(this.obPict).parent().addClass('hidden_block');
	$('.fancy_offer').addClass('hidden_block');
	$(this.obPict).closest('.offers_img').css('opacity', 0);

	if (-1 < index)
	{
		if (0 < this.offers[index].SLIDER_COUNT)
		{
			for (j = 0; j < this.offers[index].SLIDER.length; j++)
			{
				if (intPict === this.offers[index].SLIDER[j].ID)
				{
					indexPict = j;
					break;
				}
			}
			if (-1 < indexPict)
			{
				if (!!this.offers[index].SLIDER[indexPict])
				{
					this.setCurrentImg(this.offers[index].SLIDER[indexPict], true);
				}

				RowItems = BX.findChildren(this.sliders[index].LIST, {tagName: 'li'}, false);
				if (!!RowItems && 0 < RowItems.length)
				{
					strValue = intSlider+'_'+intPict;
					for (i = 0; i < RowItems.length; i++)
					{
						value = RowItems[i].getAttribute('data-value');
						if (value === strValue)
						{
							BX.addClass(RowItems[i], 'current');
						}
						else
						{
							BX.removeClass(RowItems[i], 'current');
						}
					}
				}
			}
		}
	}
	setTimeout(function(){
		$('.fancy_offer').removeClass('hidden_block');
		$('.offers_img').css('opacity', 1);
	}, 200);
};

window.JCCatalogElement.prototype.SetMainPictFromItem = function(index)
{
	if (!!this.obPict)
	{
		var boolSet = false,
			obNewPict = {};

		if (!!this.offers[index])
		{
			if (!!this.offers[index].DETAIL_PICTURE)
			{
				obNewPict = this.offers[index].DETAIL_PICTURE;
				boolSet = true;
			}
			else if (!!this.offers[index].PREVIEW_PICTURE)
			{
				obNewPict = this.offers[index].PREVIEW_PICTURE;
				boolSet = true;
			}
		}
		if (!boolSet)
		{
			if (!!this.defaultPict.detail)
			{
				obNewPict = this.defaultPict.detail;
				boolSet = true;
			}
			else if (!!this.defaultPict.preview)
			{
				obNewPict = this.defaultPict.preview;
				boolSet = true;
			}
		}
		if (boolSet)
		{
			this.setCurrentImg(obNewPict, true);
		}
	}
};

window.JCCatalogElement.prototype.showMainPictPopup = function(e)
{
	var pictContent = '';

	pictContent = '<div style="text-align: center;"><img src="'+
		this.currentImg.src+
		'" width="'+this.currentImg.width+'" height="'+this.currentImg.height+'" name=""></div>';
	this.obPopupPict.setContent(pictContent);
	this.obPopupPict.show();
	return BX.PreventDefault(e);
};

window.JCCatalogElement.prototype.QuantityUp = function()
{
	var curValue = 0,
		boolSet = true,
		calcPrice;

	if (0 === this.errorCode && this.config.showQuantity && this.canBuy)
	{
		curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
		if (!isNaN(curValue))
		{
			curValue += this.stepQuantity;
			if (this.checkQuantity)
			{
				if (curValue > this.maxQuantity)
				{
					boolSet = false;
				}
			}

			if (boolSet)
			{
				if (this.isDblQuantity)
				{
					curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
				}
				this.obQuantity.value = curValue;
			}
		}
	}
};

window.JCCatalogElement.prototype.QuantityDown = function()
{
	var curValue = 0,
		boolSet = true,
		calcPrice;

	if (0 === this.errorCode && this.config.showQuantity && this.canBuy)
	{
		curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
		if (!isNaN(curValue))
		{
			curValue -= this.stepQuantity;
			if (curValue < this.stepQuantity)
			{
				boolSet = false;
			}
			if (boolSet)
			{
				if (this.isDblQuantity)
				{
					curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
				}
				this.obQuantity.value = curValue;
			}
		}
	}
};

window.JCCatalogElement.prototype.QuantityChange = function()
{
	var curValue = 0,
		calcPrice,
		intCount,
		count;

	if (0 === this.errorCode && this.config.showQuantity)
	{
		if (this.canBuy)
		{
			curValue = (this.isDblQuantity ? parseFloat(this.obQuantity.value) : parseInt(this.obQuantity.value, 10));
			if (!isNaN(curValue))
			{
				if (this.checkQuantity)
				{
					if (curValue > this.maxQuantity)
					{
						curValue = this.maxQuantity;
					}
				}
				if (curValue < this.stepQuantity)
				{
					curValue = this.stepQuantity;
				}
				else
				{
					count = Math.round((curValue*this.precisionFactor)/this.stepQuantity)/this.precisionFactor;
					intCount = parseInt(count, 10);
					if (isNaN(intCount))
					{
						intCount = 1;
						count = 1.1;
					}
					if (count > intCount)
					{
						curValue = (intCount <= 1 ? this.stepQuantity : intCount*this.stepQuantity);
						curValue = Math.round(curValue*this.precisionFactor)/this.precisionFactor;
					}
				}
				this.obQuantity.value = curValue;
			}
			else
			{
				this.obQuantity.value = this.stepQuantity;
			}
		}
		else
		{
			this.obQuantity.value = this.stepQuantity;
		}
	}
};

window.JCCatalogElement.prototype.QuantitySet = function(index)
{
	var basisPrice = '',
		strLimit;
	if (this.errorCode === 0)
	{
		this.canBuy = this.offers[index].CAN_BUY;
		if (this.canBuy)
		{
			if (!!this.obBasketActions)
			{
				BX.style(this.obBasketActions, 'display', '');
			}
			if (!!this.obNotAvail)
			{
				BX.style(this.obNotAvail, 'display', 'none');
			}
		}
		else
		{
			if (!!this.obBasketActions)
			{
				//BX.style(this.obBasketActions, 'display', 'none');
				BX.style(this.obBasketActions, 'opacity', '0');
				BX.style(BX.findParent(BX(this.obQuantity), { 'class':'counter_block' }), 'display', 'none');
			}
			if (!!this.obNotAvail)
			{
				BX.style(this.obNotAvail, 'display', '');
			}
		}
		if (this.config.showQuantity)
		{
			this.isDblQuantity = this.offers[index].QUANTITY_FLOAT;
			this.checkQuantity = this.offers[index].CHECK_QUANTITY;
			if (this.isDblQuantity)
			{
				this.maxQuantity = parseFloat(this.offers[index].MAX_QUANTITY);
				this.stepQuantity = Math.round(parseFloat(this.offers[index].STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor;
			}
			else
			{
				this.maxQuantity = parseInt(this.offers[index].MAX_QUANTITY, 10);
				this.stepQuantity = parseInt(this.offers[index].STEP_QUANTITY, 10);
			}
			/*this.obQuantity.value = this.stepQuantity;
			this.obQuantity.disabled = !this.canBuy;*/
			if (!!this.obMeasure)
			{
				if (!!this.offers[index].MEASURE)
				{
					BX.adjust(this.obMeasure, { html : this.offers[index].MEASURE});
				}
				else
				{
					BX.adjust(this.obMeasure, { html : ''});
				}
			}
			if (!!this.obQuantityLimit.all)
			{
				if (!this.checkQuantity)
				{
					BX.adjust(this.obQuantityLimit.value, { html: '' });
					BX.adjust(this.obQuantityLimit.all, { style: {display: 'none'} });
				}
				else
				{
					strLimit = this.offers[index].MAX_QUANTITY;
					if (!!this.offers[index].MEASURE)
					{
						strLimit += (' '+this.offers[index].MEASURE);
					}
					BX.adjust(this.obQuantityLimit.value, { html: strLimit});
					BX.adjust(this.obQuantityLimit.all, { style: {display: ''} });
				}
			}
			if (!!this.obBasisPrice)
			{
				if (!!this.offers[index].BASIS_PRICE)
				{
					basisPrice = BX.message('BASIS_PRICE_MESSAGE');
					basisPrice = basisPrice.replace(
						'#PRICE#',
						BX.Currency.currencyFormat(this.offers[index].BASIS_PRICE.DISCOUNT_VALUE, this.offers[index].BASIS_PRICE.CURRENCY, true)
					);
					basisPrice = basisPrice.replace('#MEASURE#', this.offers[index].MEASURE);
					BX.adjust(this.obBasisPrice, { style: { display: '' }, html: basisPrice });
				}
				else
				{
					BX.adjust(this.obBasisPrice, { style: { display: 'none' }, html: '' });
				}
			}
		}
		this.currentBasisPrice = this.offers[index].BASIS_PRICE;
	}
};

window.JCCatalogElement.prototype.SelectOfferProp = function()
{
	var i = 0,
		strTreeValue = '',
		arTreeItem = [],
		RowItems = null,
		target = BX.proxy_context;
	if(typeof target.options !== 'undefined' && typeof target.options[target.selectedIndex] !== 'undefined')
		target = target.options[target.selectedIndex];
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		propModes = target.getAttribute('data-showtype');
		arTreeItem = strTreeValue.split('_');
		this.SearchOfferPropIndex(arTreeItem[0], arTreeItem[1]);
		RowItems = BX.findChildren(target.parentNode, {tagName: this.skuVisualParams[propModes.toUpperCase()].TAG}, false);
		if (!!RowItems && 0 < RowItems.length)
		{
			for (i = 0; i < RowItems.length; i++)
			{
				value = RowItems[i].getAttribute('data-onevalue');

				// for SELECTBOXES
				if(propModes == 'TEXT'){
					if (value === arTreeItem[1]){
						RowItems[i].setAttribute('selected', 'selected');
					}else{
						RowItems[i].removeAttribute('selected');
					}
				}else{
					if (value === arTreeItem[1]){
						$(RowItems[i]).addClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS);
					}else{
						$(RowItems[i]).removeClass(this.skuVisualParams[propModes.toUpperCase()].ACTIVE_CLASS);
					}
				}
			}
		}
	}
};

window.JCCatalogElement.prototype.SearchOfferPropIndex = function(strPropID, strPropValue)
{
	var strName = '',
		arShowValues = false,
		arCanBuyValues = [],
		index = -1,
		i, j,
		arFilter = {},
		tmpFilter = [];

	for (i = 0; i < this.treeProps.length; i++)
	{
		if (this.treeProps[i].ID === strPropID)
		{
			index = i;
			break;
		}
	}

	if (-1 < index)
	{
		for (i = 0; i < index; i++)
		{
			strName = 'PROP_'+this.treeProps[i].ID;
			arFilter[strName] = this.selectedValues[strName];
		}
		strName = 'PROP_'+this.treeProps[index].ID;
		arFilter[strName] = strPropValue;
		for (i = index+1; i < this.treeProps.length; i++)
		{
			strName = 'PROP_'+this.treeProps[i].ID;
			arShowValues = this.GetRowValues(arFilter, strName);
			if (!arShowValues)
			{
				break;
			}
			if (this.config.showAbsent)
			{
				arCanBuyValues = [];
				tmpFilter = [];
				tmpFilter = BX.clone(arFilter, true);
				for (j = 0; j < arShowValues.length; j++)
				{
					tmpFilter[strName] = arShowValues[j];
					/*if (this.GetCanBuy(tmpFilter))
					{*/
						arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
					//}
				}
			}
			else
			{
				arCanBuyValues = arShowValues;
			}
			if (!!this.selectedValues[strName] && BX.util.in_array(this.selectedValues[strName], arCanBuyValues))
			{
				arFilter[strName] = this.selectedValues[strName];
			}
			else
			{
				arFilter[strName] = arCanBuyValues[0];
			}
			this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
		}
		this.selectedValues = arFilter;

		this.ChangeInfo();
	}
};

window.JCCatalogElement.prototype.RowLeft = function()
{
	var strTreeValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		for (i = 0; i < this.treeProps.length; i++)
		{
			if (this.treeProps[i].ID === strTreeValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.treeRowShowSize < this.showCount[index])
		{
			if (0 > this.showStart[index])
			{
				this.showStart[index]++;
				BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
				//BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeEnableArrow });
			}

			/*if (0 <= this.showStart[index])
			{
				BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeDisableArrow });
			}*/
		}
	}
};

window.JCCatalogElement.prototype.RowRight = function()
{
	var strTreeValue = '',
		index = -1,
		i,
		target = BX.proxy_context;
	if (!!target && target.hasAttribute('data-treevalue'))
	{
		strTreeValue = target.getAttribute('data-treevalue');
		for (i = 0; i < this.treeProps.length; i++)
		{
			if (this.treeProps[i].ID === strTreeValue)
			{
				index = i;
				break;
			}
		}
		if (-1 < index && this.treeRowShowSize < this.showCount[index])
		{
			if ((this.treeRowShowSize - this.showStart[index]) < this.showCount[index])
			{
				this.showStart[index]--;
				BX.adjust(this.obTreeRows[index].LIST, { style: { marginLeft: this.showStart[index]*20+'%' }});
				//BX.adjust(this.obTreeRows[index].LEFT, { style: this.treeEnableArrow });
			}

			/*if ((this.treeRowShowSize - this.showStart[index]) >= this.showCount[index])
			{
				BX.adjust(this.obTreeRows[index].RIGHT, { style: this.treeDisableArrow });
			}*/
		}
	}
};

window.JCCatalogElement.prototype.UpdateRow = function(intNumber, activeID, showID, canBuyID)
{
	var i = 0,
		showI = 0,
		value = '',
		countShow = 0,
		strNewLen = '',
		obData = {},
		RowItems = null,
		pictMode = false,
		extShowMode = false,
		isCurrent = false,
		selectIndex = 0,
		obLeft = this.treeEnableArrow,
		obRight = this.treeEnableArrow,
		currentShowStart = 0;

	if (-1 < intNumber && intNumber < this.obTreeRows.length)
	{
		propMode = this.treeProps[intNumber].DISPLAY_TYPE;
		RowItems = BX.findChildren(this.obTreeRows[intNumber].LIST, {tagName: this.skuVisualParams[propMode].TAG}, false);
		if (!!RowItems && 0 < RowItems.length)
		{
			selectMode = ('SELECT' === this.treeProps[intNumber].DISPLAY_TYPE);
			countShow = showID.length;
			obData = {
				style: {},
				props: {
					disabled: '',
					selected: '',
				},
			};

			for (i = 0; i < RowItems.length; i++){
				value = RowItems[i].getAttribute('data-onevalue');
				isCurrent = (value === activeID && value !=0);
				/*if (BX.util.in_array(value, canBuyID)){
					obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS : '');
				}else{
					obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS+' '+this.skuVisualParams[propMode].HIDE_CLASS : this.skuVisualParams[propMode].HIDE_CLASS);
				}*/
				obData.props.className = (isCurrent ? this.skuVisualParams[propMode].ACTIVE_CLASS : '');

				if(selectMode){
					obData.props.disabled = 'disabled';
					obData.props.selected = (isCurrent ? 'selected' : '');
				}else{
					obData.style.display = 'none';
				}

				if (BX.util.in_array(value, showID)){
					if(selectMode){
						obData.props.disabled = '';
					}else{
						obData.style.display = '';
					}
					if (isCurrent){
						selectIndex = showI;
					}
					showI++;
				}
				BX.adjust(RowItems[i], obData);
			}

			if(selectMode){
				if($(this.obTreeRows[intNumber].LIST).parent().hasClass('ik_select'))
					$(this.obTreeRows[intNumber].LIST).ikSelect('reset');
			}

			this.showCount[intNumber] = countShow;
			this.showStart[intNumber] = currentShowStart;
		}
	}
};

window.JCCatalogElement.prototype.GetRowValues = function(arFilter, index)
{
	var arValues = [],
		i = 0,
		j = 0,
		boolSearch = false,
		boolOneSearch = true;

	if (0 === arFilter.length)
	{
		for (i = 0; i < this.offers.length; i++)
		{
			if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
			{
				arValues[arValues.length] = this.offers[i].TREE[index];
			}
		}
		boolSearch = true;
	}
	else
	{
		for (i = 0; i < this.offers.length; i++)
		{
			boolOneSearch = true;
			for (j in arFilter)
			{
				if (arFilter[j] !== this.offers[i].TREE[j])
				{
					boolOneSearch = false;
					break;
				}
			}
			if (boolOneSearch)
			{
				if (!BX.util.in_array(this.offers[i].TREE[index], arValues))
				{
					arValues[arValues.length] = this.offers[i].TREE[index];
				}
				boolSearch = true;
			}
		}
	}
	return (boolSearch ? arValues : false);
};

window.JCCatalogElement.prototype.GetCanBuy = function(arFilter)
{
	var i = 0,
		j = 0,
		boolOneSearch = true,
		boolSearch = false;

	for (i = 0; i < this.offers.length; i++)
	{
		boolOneSearch = true;
		for (j in arFilter)
		{
			if (arFilter[j] !== this.offers[i].TREE[j])
			{
				boolOneSearch = false;
				break;
			}
		}
		if (boolOneSearch)
		{
			if (this.offers[i].CAN_BUY)
			{
				boolSearch = true;
				break;
			}
		}
	}
	return boolSearch;
};

window.JCCatalogElement.prototype.SetCurrent = function()
{
	var i = 0,
		j = 0,
		strName = '',
		arShowValues = false,
		arCanBuyValues = [],
		arFilter = {},
		tmpFilter = [],
		current = this.offers[this.offerNum].TREE;

	for (i = 0; i < this.treeProps.length; i++)
	{
		strName = 'PROP_'+this.treeProps[i].ID;
		arShowValues = this.GetRowValues(arFilter, strName);
		if (!arShowValues)
		{
			break;
		}
		if (BX.util.in_array(current[strName], arShowValues))
		{
			arFilter[strName] = current[strName];
		}
		else
		{
			arFilter[strName] = arShowValues[0];
			this.offerNum = 0;
		}
		if (this.config.showAbsent)
		{
			arCanBuyValues = [];
			tmpFilter = [];
			tmpFilter = BX.clone(arFilter, true);
			for (j = 0; j < arShowValues.length; j++)
			{
				tmpFilter[strName] = arShowValues[j];
				if (this.GetCanBuy(tmpFilter))
				{
					arCanBuyValues[arCanBuyValues.length] = arShowValues[j];
				}
			}
		}
		else
		{
			arCanBuyValues = arShowValues;
		}
		this.UpdateRow(i, arFilter[strName], arShowValues, arCanBuyValues);
	}

	this.selectedValues = arFilter;
	this.ChangeInfo();
};

window.JCCatalogElement.prototype.ChangeInfo = function()
{
	var index = -1,
		i = 0,
		j = 0,
		RowItems=null,
		boolOneSearch = true;

	for (i = 0; i < this.offers.length; i++)
	{
		boolOneSearch = true;
		for (j in this.selectedValues)
		{
			if (this.selectedValues[j] !== this.offers[i].TREE[j])
			{
				boolOneSearch = false;
				break;
			}
		}
		if (boolOneSearch)
		{
			index = i;
			break;
		}
	}
	if (-1 < index)
	{
		var measure = this.offers[index].MEASURE && this.offers[index].SHOW_MEASURE=="Y" ? this.offers[index].MEASURE : '';
		this.setPrice(this.offers[index].PRICE, measure);
		for (i = 0; i < this.offers.length; i++)
		{

			if (this.config.showOfferGroup && this.offers[i].OFFER_GROUP)
			{
				if (i !== index)
				{
					BX.adjust(BX(this.visual.OFFER_GROUP+this.offers[i].ID), { style: {display: 'none'} });
				}
			}
			/*set slider*/
			if (!!this.sliders[i].ID)
			{
				if (i === index)
				{
					this.sliders[i].START = 0;
					if(this.sliders[i].CONT){

						RowItems = $(this.sliders[i].CONT).find("li");
						this.SliderImages=RowItems.length;
						if(this.SliderImages>1){
							BX.adjust(this.sliders[i].CONT, {style: { display: ''}});
						}else{
							BX.adjust(this.sliders[i].CONT, {style: { display: 'none'}});
						}
					}
					BX.adjust(this.sliders[i].CONT_M, {style: { display: ''}});
				}
				else
				{
					if(this.sliders[i].CONT)
						BX.adjust(this.sliders[i].CONT, {style: { display: 'none'}});
					BX.adjust(this.sliders[i].CONT_M, {style: { display: 'none'}});
				}
			}
		}
		if (this.config.showOfferGroup && this.offers[index].OFFER_GROUP)
		{
			BX.adjust(BX(this.visual.OFFER_GROUP+this.offers[index].ID), { style: {display: ''} });
		}
		if (0 < this.offers[index].SLIDER_COUNT)
		{
			this.SetMainPict(this.offers[index].ID, this.offers[index].SLIDER[0].ID);
		}
		else
		{
			this.SetMainPictFromItem(index);
		}
		if (this.config.showSkuProps && !!this.obSkuProps)
		{

			if (!this.offers[index].DISPLAY_PROPERTIES || this.offers[index].DISPLAY_PROPERTIES.length === 0)
			{
				BX.adjust(this.obSkuProps, {style: {display: 'none'}, html: ''});
			}
			else
			{
				BX.adjust(this.obSkuProps, {style: {display: ''}, html: this.offers[index].DISPLAY_PROPERTIES});
			}

		}
		if (this.config.showSkuProps && !!this.obSkuArticleProps)
		{
			if ('DISPLAY_PROPERTIES_CODE' in this.offers[index]){
				if ('ARTICLE' in this.offers[index].DISPLAY_PROPERTIES_CODE){
					if(this.offers[index].DISPLAY_PROPERTIES_CODE.ARTICLE.VALUE){
						BX.adjust(this.obSkuArticleProps, {style: {display: ''}, html: this.offers[index].DISPLAY_PROPERTIES_CODE.ARTICLE.VALUE_FORMAT});
					}
				}else{
					BX.adjust(this.obSkuArticleProps, {style: {display: 'none'}, html: ''});
				}
			}else{
				BX.adjust(this.obSkuArticleProps, {style: {display: 'none'}, html: ''});
			}
		}

		setLocationSKU(this.offers[index].URL);

		$(this.obBasketActions).closest('.counter_wrapp').addClass('hidden_block');
		// $('.one_click').addClass('hidden_block');

		this.offerNum = index;
		this.QuantitySet(this.offerNum);
		this.setStoreBlock(this.offers[index].ID);
		this.setQuantityStore(this.offers[index].MAX_QUANTITY, this.offers[index].AVAILIABLE.TEXT);
		// this.allowViewedCount(true);
		this.incViewedCounter();
		BX.onCustomEvent('onCatalogStoreProductChange', [this.offers[this.offerNum].ID]);
		$(this.obPict).parent().data('id', this.offers[index].ID);

		$(this.obProduct).find('.buy_block .buys_wrapp').hide();
		$(this.obProduct).find('.buy_block .buys_wrapp').css('opacity','0');
		$(this.obProduct).find('.buy_block .o_'+this.offers[this.offerNum].ID).show('100', function(){
			$(this).css('opacity','1');
		});

		$(this.obProduct).find('.like_icons .wish_item').hide();
		$(this.obProduct).find('.like_icons .compare_item').hide();
		$(this.obProduct).find('.prices_block  .view_sale_block.offers').hide();
		$(this.obProduct).find('.like_icons .o_'+this.offers[this.offerNum].ID).show();
		$(this.obProduct).find('.prices_block  .view_sale_block.offers.o_'+this.offers[this.offerNum].ID).show();

		$('.catalog_detail .tabs_section .tabs_content .form.inline input[data-sid="PRODUCT_NAME"]').attr('value', $('h1').text() + '(' + this.offers[index].NAME + ')');

		/*check button type*/
		/*itemParams = {
			itemID: this.offers[index].ID,
			itemName: this.product.name,
			itemIBlockID: this.offers[index].IBLOCK_ID,
			itemMaxQuantity: this.offers[index].MAX_QUANTITY,
			defaultCount: this.defaultCount,
			oneClick: "Y",
			oneClickTxt: BX.message("ONE_CLICK_BUY"),
			itemBuy: (this.canBuy ? "Y" : "N"),
			buyLink: this.visual.BUY_ID,
			basketLink: this.visual.BASKET_LINK,
			basketLinkURL: this.basketLinkURL,
			itemSubscribe: this.offers[index].CATALOG_SUBSCRIBE,
			item: {
				"SUBSCRIBE_ID": this.visual.SUBSCRIBE_ID,
				"SUBSCRIBED_ID": this.visual.SUBSCRIBED_ID,
			},
			classButton: 'big_btn'
		};

		BX.ajax.loadJSON(
			arMShopOptions['SITE_DIR']+'ajax/get_item_info.php',
			itemParams,
			BX.delegate(this.ItemInfoResult, this)
		);

		compareParams = {
			ajax_action: 'Y'
		};
		BX.ajax.loadJSON(
			arMShopOptions['SITE_DIR']+'ajax/get_compare_count.php',
			compareParams,
			BX.delegate(this.CompareCountResult, this)
		);*/
		//console.log(this.offers[index]);
	}
};

/*set store block*/
window.JCCatalogElement.prototype.setStoreBlock = function(id)
{
	$('.stores_tab > div').fadeOut();
	$('.stores_tab .sku_stores_'+id).fadeIn();
}

/*set store quantity*/
window.JCCatalogElement.prototype.setQuantityStore = function(quantity, text)
{
	if(parseFloat(quantity)>0){
		$(this.storeQuanity).find('.icon').removeClass('order').addClass('stock');
	}else{
		$(this.storeQuanity).find('.icon').removeClass('stock').addClass('order');
	}
	$(this.storeQuanity).find('.icon + span').html(text);
	if(!$(".stores_tab").length){
		$('.item-stock .store_view').removeClass('store_view');
	}
}

/*get compare sku*/
window.JCCatalogElement.prototype.CompareCountResult = function(result)
{
	if(result.COMPARE_COUNT){
		for(var i in result.ITEMS){
			if(result.ITEMS[i]==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].COMPARE_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].COMPARE_ACTIVE=false;
			}
		}
		if(this.offers[this.offerNum].COMPARE_ACTIVE){
			$(this.obCompare).addClass('added');
			$(this.obCompare).find('.value:not(.added)').hide();
			$(this.obCompare).find('.value.added').css('display','inline-block');
		}else{
			$(this.obCompare).removeClass('added');
			$(this.obCompare).find('.value.added').hide();
			$(this.obCompare).find('.value:not(.added)').css('display','inline-block');
		}
	}
}

/*get item info*/
window.JCCatalogElement.prototype.ItemInfoResult = function(result)
{
	if(result.HTML){
		$(this.obBasketActions).html(result.HTML);
		$(this.obBasketActions).show();
		this.obAddToBasketBtn = BX(this.visual.BUY_ID);
		this.obBasketBtn = BX(this.visual.BASKET_LINK);
		this.obSubscribeBtn = BX(this.visual.SUBSCRIBE_ID);
		this.obSubscribedBtn = BX(this.visual.SUBSCRIBED_ID);
		BX.bind(this.obAddToBasketBtn, 'click', BX.delegate(this.Add2Basket, this));
		$(this.obBasketActions).removeClass('wide');
		this.ajax_type_item=result.BUYMISSINGGOODS;
		if(result.BUYMISSINGGOODS!="ADD" && !this.canBuy){
			$(this.obBasketActions).addClass('wide');
		}else{
			$(this.obQuantity).css('display','');
		}
		if(result.ONE_CLICK_HTML){
			$('.wrapp_one_click').html(result.ONE_CLICK_HTML);
		}

	}
	//if(this.canBuy){
		basketParams = {
			ajax_action: 'Y'
		};
		BX.ajax.loadJSON(
			arMShopOptions['SITE_DIR']+'ajax/get_basket_count.php',
			basketParams,
			BX.delegate(this.BasketCountResult, this)
		);
	//}
}

/*get basket items*/
window.JCCatalogElement.prototype.BasketCountResult = function(result)
{
	//if(result.TOTAL_COUNT){
		for(var i in result.ITEMS){
			if(result.ITEMS[i].PRODUCT_ID==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].BASKET_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].BASKET_ACTIVE=false;
			}
		}
		for(var i in result.SUBSCRIBE_ITEMS){
			if(result.SUBSCRIBE_ITEMS[i].PRODUCT_ID==this.offers[this.offerNum].ID){
				this.offers[this.offerNum].SUBSCRIBE_ACTIVE=true;
				break;
			}else{
				this.offers[this.offerNum].SUBSCRIBE_ACTIVE=false;
			}
		}

		this.BasketStateRefresh();
	//}
}

window.JCCatalogElement.prototype.BasketStateRefresh = function(buy_basket)
{
	if(this.offers[this.offerNum].SUBSCRIBE_ACTIVE){
		$(this.obBasketActions).addClass('wide');
		$(this.obSubscribeBtn).hide();
		$(this.obSubscribedBtn).show();
	}else{
		$(this.obBasketActions).addClass('wide');
		$(this.obSubscribedBtn).hide();
		$(this.obSubscribeBtn).show();
	}

	if(this.offers[this.offerNum].BASKET_ACTIVE){
		$(this.obAddToBasketBtn).hide();
		$(this.obQuantity).closest('.counter_wrapp').find('.counter_block').hide();
		$(this.obBasketBtn).show();
		$(this.obBasketActions).addClass('wide');
	}else{
		$(this.obBasketActions).removeClass('wide');
		$(this.obBasketBtn).hide();
		if(this.ajax_type_item=="ADD" || this.canBuy)
			$(this.obQuantity).closest('.counter_wrapp').find('.counter_block').show();
		$(this.obAddToBasketBtn).show();
	}
	if(!this.canBuy){
		$(this.obBasketActions).addClass('wide');
	}
	if(this.canBuy){
		$('.one_click').removeClass('hidden_block').css('opacity', 1);
	}
	BX.style(this.obBasketActions, 'opacity', '1');
	$(this.obBasketActions).closest('.counter_wrapp').removeClass('hidden_block').css('opacity',1);

	if(buy_basket!== 'undefined' && buy_basket=="Y"){
		if($("#basket_line .basket_fly").length && $(window).outerWidth()>768)
		{
			// preAnimateBasketFly($("#basket_line .basket_fly"), 200, 333);
			basketFly('open');
		}
		else if($("#basket_line .cart").length)
		{
			if($("#basket_line .cart").is(".empty_cart"))
			{
				$("#basket_line .cart").removeClass("empty_cart").find(".cart_wrapp a.basket_link").removeAttr("href").addClass("cart-call");
				touchBasket('.cart:not(.empty_cart) .basket_block .link');
			}
			reloadTopBasket('add', $('#basket_line'), 200, 2000, 'Y');
			/*if($(window).outerWidth() > 520){
				//if(arMShopOptions['THEME']['SHOW_BASKET_ONADDTOCART'] !== 'N'){
					preAnimateBasketPopup('', $('.card_popup_frame'), 0, 200);
				//}
			};*/
		}
		animateBasketLine(200);
	}
}

window.JCCatalogElement.prototype.setPrice = function(price, measure)
{
	var prices = '';
	if (!!this.obPrice.price)
	{
		prices=BX.Currency.currencyFormat(price.DISCOUNT_VALUE, price.CURRENCY, true);
		if(measure){
			prices=prices+'/'+measure;
		}
		BX.adjust(this.obPrice.price, {html: prices});
		if (price.DISCOUNT_VALUE !== price.VALUE)
		{
			if (this.config.showOldPrice){
				if (!!this.obPrice.full){
					BX.adjust(this.obPrice.full, {style: {display: ''}, html: BX.Currency.currencyFormat(price.VALUE, price.CURRENCY, true)});
				}
				if(this.config.showPercent){
					$(this.obPrice.full).closest('.cost').find('.sale_block').show();
					$(this.obPrice.full).closest('.cost').find('.value').html(price.DISCOUNT_DIFF_PERCENT_RAW);
					$(this.obPrice.full).closest('.cost').find('.text span').html(BX.Currency.currencyFormat(price.DISCOUNT_DIFF, price.CURRENCY, true));
				}
			}
		}
		else
		{
			if (this.config.showOldPrice)
			{
				if (!!this.obPrice.full)
				{
					BX.adjust(this.obPrice.full, {style: {display: 'none'}, html: ''});
				}
				if (!!this.obPrice.discount)
				{
					BX.adjust(this.obPrice.discount, {style: {display: 'none'}, html: ''});
				}
			}
			if (this.config.showPercent)
			{
				if (!!this.obPrice.percent)
				{
					BX.adjust(this.obPrice.percent, {style: {display: 'none'}, html: ''});
				}
				$(this.obPrice.full).closest('.cost').find('.sale_block').hide();
				$(this.obPrice.full).closest('.cost').find('.value').html('');
				$(this.obPrice.full).closest('.cost').find('.text span').html('');
			}
		}
	}
};

window.JCCatalogElement.prototype.Compare = function()
{
	var compareParams, compareLink;
	if($(this.obCompare).find('.added').is(':visible')){
		compareLink = this.compareData.compareUrlDel;
		this.compareData.Added = false;
	}else{
		compareLink = this.compareData.compareUrl;
		this.compareData.Added = true;
	}
	if (!!compareLink){
		switch (this.productType){
			case 1://product
			case 2://set
				compareLink = compareLink.replace('#ID#', this.product.id.toString());
				break;
			case 3://sku
				compareLink = compareLink.replace('#ID#', this.offers[this.offerNum].ID);
				break;
		}
		compareParams = {
			ajax_action: 'Y'
		};
		BX.ajax.loadJSON(
			compareLink,
			compareParams,
			BX.proxy(this.CompareResult, this)
		);
	}
};

window.JCCatalogElement.prototype.CompareResult = function(result)
{
	var popupContent, popupButtons, popupTitle;

	if (typeof result !== 'object')
	{
		return false;
	}
	if (result.STATUS === 'OK')
	{
		BX.onCustomEvent('OnCompareChange');
		if(!this.compareData.Added){
			$(this.obCompare).removeClass('added');
			$(this.obCompare).find('.added').hide();
			$(this.obCompare).find('.value:not(.added)').css('display','inline-block');
		}
		else{
			$(this.obCompare).addClass('added');
			$(this.obCompare).find('.value:not(.added)').hide();
			$(this.obCompare).find('.added').css('display','inline-block');
		}
		jsAjaxUtil.InsertDataToNode(arMShopOptions['SITE_DIR'] + 'ajax/show_compare_preview_top.php', 'compare_line', false);
	}
	else
	{
		console.log(BX.message('ADD_ERROR_COMPARE'));
	}
	return false;
};

window.JCCatalogElement.prototype.CompareRedirect = function()
{
	if (!!this.compareData.comparePath)
	{
		location.href = this.compareData.comparePath;
	}
	else
	{
		this.obPopupWin.close();
	}
};

window.JCCatalogElement.prototype.InitBasketUrl = function()
{
	var product_url='';
	this.basketUrl = (this.basketMode === 'ADD' ? this.basketData.add_url : this.basketData.buy_url);
	switch (this.productType)
	{
		case 1://product
		case 2://set
			this.basketUrl = this.basketUrl.replace('#ID#', this.product.id.toString());
			product_url=this.product.id.toString();
			break;
		case 3://sku
			this.basketUrl = this.basketUrl.replace('#ID#', this.offers[this.offerNum].ID);
			product_url=this.offers[this.offerNum].URL;
			break;
	}
	this.basketParams = {
		'ajax_basket': 'Y'
	};
	if (this.config.showQuantity)
	{
		this.basketParams[this.basketData.quantity] = this.obQuantity.value;
	}
	if (!!this.basketData.sku_props)
	{
		this.basketParams[this.basketData.sku_props_var] = this.basketData.sku_props;
	}
	if (!!product_url)
	{
		this.basketParams["REQUEST_URI"] = product_url;
	}
};

window.JCCatalogElement.prototype.FillBasketProps = function()
{
	if (!this.visual.BASKET_PROP_DIV)
	{
		return;
	}
	var
		i = 0,
		propCollection = null,
		foundValues = false,
		obBasketProps = null;
	if (this.basketData.useProps && !this.basketData.emptyProps)
	{
		if (!!this.obPopupWin && !!this.obPopupWin.contentContainer)
		{
			obBasketProps = this.obPopupWin.contentContainer;
		}
	}
	else
	{
		obBasketProps = BX(this.visual.BASKET_PROP_DIV);
	}
	if (!!obBasketProps)
	{
		propCollection = obBasketProps.getElementsByTagName('select');
		if (!!propCollection && !!propCollection.length)
		{
			for (i = 0; i < propCollection.length; i++)
			{
				if (!propCollection[i].disabled)
				{
					switch(propCollection[i].type.toLowerCase())
					{
						case 'select-one':
							this.basketParams[propCollection[i].name] = propCollection[i].value;
							foundValues = true;
							break;
						default:
							break;
					}
				}
			}
		}
		propCollection = obBasketProps.getElementsByTagName('input');
		if (!!propCollection && !!propCollection.length)
		{
			for (i = 0; i < propCollection.length; i++)
			{
				if (!propCollection[i].disabled)
				{
					switch(propCollection[i].type.toLowerCase())
					{
						case 'hidden':
							this.basketParams[propCollection[i].name] = propCollection[i].value;
							foundValues = true;
							break;
						case 'radio':
							if (propCollection[i].checked)
							{
								this.basketParams[propCollection[i].name] = propCollection[i].value;
								foundValues = true;
							}
							break;
						default:
							break;
					}
				}
			}
		}
	}
	if (!foundValues)
	{
		this.basketParams[this.basketData.props] = [];
		this.basketParams[this.basketData.props][0] = 0;
	}
};

window.JCCatalogElement.prototype.SendToBasket = function()
{
	if (!this.canBuy)
	{
		return;
	}
	this.InitBasketUrl();
	this.FillBasketProps();
	BX.ajax.loadJSON(
		this.basketUrl,
		this.basketParams,
		BX.proxy(this.BasketResult, this)
	);
};

window.JCCatalogElement.prototype.Add2Basket = function()
{
	this.basketMode = 'ADD';
	this.Basket();
};

window.JCCatalogElement.prototype.BuyBasket = function()
{
	this.basketMode = 'BUY';
	this.Basket();
};

window.JCCatalogElement.prototype.Basket = function()
{
	var contentBasketProps = '';
	if (!this.canBuy)
	{
		return;
	}
	this.SendToBasket();
};

window.JCCatalogElement.prototype.BasketResult = function(arResult)
{
	var popupContent, popupButtons, popupTitle, productPict;
	if (!!this.obPopupWin)
	{
		this.obPopupWin.close();
	}
	if (typeof arResult !== 'object')
	{
		return false;
	}
	if (arResult.STATUS === 'OK' && this.basketMode === 'BUY')
	{
		this.BasketRedirect();
	}
	else
	{
		// this.InitPopupWindow();
		popupTitle = {
			content: BX.create('div', {
				style: { marginRight: '30px', whiteSpace: 'nowrap' },
				text: (arResult.STATUS === 'OK' ? BX.message('TITLE_SUCCESSFUL') : BX.message('TITLE_ERROR'))
			})
		};
		if (arResult.STATUS === 'OK')
		{
			BX.onCustomEvent('OnBasketChange');
			this.offers[this.offerNum].BASKET_ACTIVE=true;
			this.BasketStateRefresh("Y");
		}
		else
		{
			console.log(BX.message('ADD_ERROR_BASKET'));
		}
	}
	return false;
};

window.JCCatalogElement.prototype.BasketRedirect = function()
{
	location.href = (!!this.basketData.basketUrl ? this.basketData.basketUrl : BX.message('BASKET_URL'));
};

window.JCCatalogElement.prototype.InitPopupWindow = function()
{
	if (!!this.obPopupWin)
	{
		return;
	}
	this.obPopupWin = BX.PopupWindowManager.create('CatalogElementBasket_'+this.visual.ID, null, {
		autoHide: false,
		offsetLeft: 0,
		offsetTop: 0,
		overlay : true,
		closeByEsc: true,
		titleBar: true,
		closeIcon: {top: '10px', right: '10px'}
	});
};

window.JCCatalogElement.prototype.onPopupWindowShow = function(popup)
{
	BX.bind(document, 'click', BX.proxy(this.popupWindowClick, this));
};

window.JCCatalogElement.prototype.onPopupWindowClose = function(popup, event)
{
	BX.unbind(document, 'click', BX.proxy(this.popupWindowClick, this));
};

window.JCCatalogElement.prototype.popupWindowClick = function()
{
	if (!!this.obPopupPict && typeof (this.obPopupPict) === 'object')
	{
		if (this.obPopupPict.isShown())
		{
			this.obPopupPict.close();
		}
	}
};

window.JCCatalogElement.prototype.incViewedCounter = function()
{
	if (this.currentIsSet && !this.updateViewedCount)
	{

		switch (this.productType)
		{
			case 1:
			case 2:
				this.viewedCounter.params.PRODUCT_ID = this.product.id;
				this.viewedCounter.params.PARENT_ID = this.product.id;
				break;
			case 3:
				this.viewedCounter.params.PARENT_ID = this.product.id;
				this.viewedCounter.params.PRODUCT_ID = this.offers[this.offerNum].ID;
				break;
			default:
				return;
		}
		this.viewedCounter.params.SITE_ID = BX.message('SITE_ID');
		this.updateViewedCount = true;
		BX.ajax.post(
			this.viewedCounter.path,
			this.viewedCounter.params,
			BX.delegate(function(){ this.updateViewedCount = false; }, this)
		);
	}
};

window.JCCatalogElement.prototype.allowViewedCount = function(update)
{
	update = !!update;
	this.currentIsSet = true;
	if (update)
	{
		this.incViewedCounter();
	}
};
})(window);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:98:"/bitrix/templates/aspro_mshop/components/bitrix/forum.topic.reviews/main/script.js?145466930825926";s:6:"source";s:82:"/bitrix/templates/aspro_mshop/components/bitrix/forum.topic.reviews/main/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(window){
	window.FTRList = function (params) {
		this.id = 'FTRList' + params.form.id;
		this.mess = {};
		this.form = params.form;
		if (!!params["id"]) {
			for (var ii = 0; ii < params["id"].length; ii++) {
				this.bind(params["id"][ii]);
			}
		}
		this.params = {
			preorder: (params.preorder == "Y"),
			pageNumber: params.pageNumber,
			pageCount: params.pageCount
		};
		BX.addCustomEvent(this.form, 'onAdd', BX.delegate(this.add, this));
		BX.addCustomEvent(this.form, 'onRequest', BX.delegate(function () {
			if (typeof this.params.pageNumber != 'undefined') {
				var pageNumberInput = BX.findChild(this.form, {attr: {name: 'pageNumber'}});
				if (!pageNumberInput) {
					pageNumberInput = BX.create("input", {props: {type: "hidden", name: 'pageNumber'}});
					this.form.appendChild(pageNumberInput);
				}
				pageNumberInput.value = this.params.pageNumber;
			}
			if (typeof this.params.pageCount != 'undefined') {
				var pageCountInput = BX.findChild(this.form, {attr: {name: 'pageCount'}});
				if (!pageCountInput) {
					pageCountInput = BX.create("input", {props: {type: "hidden", name: 'pageCount'}});
					this.form.appendChild(pageCountInput);
				}
				pageCountInput.value = this.params.pageCount;
			}
		}, this));
		BX.addCustomEvent(this.form, 'onResponse', BX.delegate(function () {
			var input_pageno = BX.findChild(this.form, { 'attr': { 'name': 'pageNumber' }}, true);
			if (input_pageno) {
				BX.remove(input_pageno);
			}
		}, this));
	};
	window.FTRList.prototype = {
		add : function(id, result)
		{
			var
				container = BX(this.form.id + 'container'),
				listform,
				post = {className: /reviews-reply-form|reviews-collapse/},
				msgNode = window.fTextToNode(result.message);
			if (! container)
			{
				container = BX.create('div', {
					'attrs' : {
						'id' : this.form.id + 'container'},
					'props': {
						'className': 'reviews-block-container reviews-reviews-block-container'},
					'children': [
						BX.create('div', {
							'props': {
								'className': 'reviews-block-outer'
							},
							'children': [
								BX.create('div', {
									'props': {
										'className': 'reviews-block-inner'
									}
								})
							]
						})
					]
				});
				window.fReplaceOrInsertNode(container, null, BX.findChild(document, post, true).parentNode, post);
				container = BX(this.form.id + 'container');
			}
			listform = (container ? BX.findChild(container, {className: 'reviews-block-inner'}, true) : null);
			if (msgNode && listform)
			{
				if (!!result["allMessages"])
				{
					window.fReplaceOrInsertNode(msgNode, listform, BX.findChild(document, post, true).parentNode, post);

					if (!!result.navigation && !!result.pageNumber)
					{
						var navDIV = window.fTextToNode(result.navigation), i,
							navPlaceholders = (navDIV ? BX.findChildren(container.parentNode, { className : 'reviews-navigation-box' } , true) : null);
						if (navDIV)
						{
							if (!navPlaceholders) // then add ...
							{
								container.parentNode.insertBefore(BX.create('div', {props:{className:"reviews-navigation-box reviews-navigation-top"}}), container);
								var tmpDiv = container;
								// bottom
								do {
									tmpDiv = tmpDiv.nextSibling;
								} while (tmpDiv && tmpDiv.nodeType != 1);
								var bottomPager = BX.create('div', {props:{className:"reviews-navigation-box reviews-navigation-bottom"}});
								if (tmpDiv)
									container.parentNode.insertBefore( bottomPager , tmpDiv);
								else
									container.parentNode.appendChild(bottomPager);

								navPlaceholders = BX.findChildren(container.parentNode, { className : 'reviews-navigation-box' } , true);
							}
							for (i = 0; i < navPlaceholders.length; i++)
								navPlaceholders[i].innerHTML = navDIV.innerHTML;
						}

						this.params.pageNumber = result.pageNumber;
						this.params.pageCount = result.pageCount;
					}
					if (result["messagesID"] && typeof result["messagesID"] == "object")
					{
						for (var ii = 0; ii < result["messagesID"].length; ii++)
						{
							if (result["messagesID"][ii] != id)
								this.bind(result["messagesID"][ii]);
						}
					}
				}
				else if (typeof result.message != 'undefined')
				{
					if (this.params.preorder)
						listform.appendChild(msgNode);
					else
						listform.insertBefore(msgNode, listform.firstChild);
				}
				window.fRunScripts(result.message);
				this.bind(id);
			}
		},
		bind : function(id)
		{
			var node = BX('message' + id);
			if (!!node)
			{
				this.mess['m' + id] = {
					node : node,
					author : {
						id : node.getAttribute("bx-author-id"),
						name : node.getAttribute("bx-author-name")
					}
				};

				var buttons = BX.findChildren(node, {tagName : "A", className : "reviews-button-small"}, true),
					func = BX.delegate(function() { var res = BX.proxy_context; this.act(res.getAttribute("bx-act"), id); }, this),
					func2 = BX.delegate(function(){ this.act('reply', id); }, this),
					func3 = BX.delegate(function(){ this.act('quote', id); }, this);
				if (!!buttons && buttons.length > 0)
				{
					for (var ii = 0; ii < buttons.length; ii++)
					{
						if (buttons[ii].getAttribute("bx-act") == "moderate" || buttons[ii].getAttribute("bx-act") == "del")
						{
							BX.adjust(buttons[ii],
								{
									events : { click : func },
									attrs : {
										"bx-href" : buttons[ii].getAttribute("href"),
										href : "javascript:void(0);"
									}
								}
							);
						}
						else if (!!this.form)
						{
							if (buttons[ii].getAttribute("bx-act") == "reply")
							{
								BX.bind(buttons[ii], 'click', func2);
							}
							else if (buttons[ii].getAttribute("bx-act") == "quote")
							{
								BX.bind(buttons[ii], 'mousedown', func3);
							}
						}
					}
				}
			}
		},
		act : function(act, id)
		{
			if (!id || !this.mess['m' + id]) {
				BX.DoNothing();
			}
			else if (act == 'quote') {
				var selection = window.GetSelection();
				if (document["getSelection"])
				{
					selection = selection.replace(/\r\n\r\n/gi, "_newstringhere_").replace(/\r\n/gi, " ");
					selection = selection.replace(/  /gi, "").replace(/_newstringhere_/gi, "\r\n\r\n");
				}

				if (selection === "" && id > 0 && BX('message_text_' + id, true))
				{
					var message = BX('message_text_' + id, true);
					if (typeof(message) == "object" && message)
						selection = message.innerHTML;
				}

				selection = selection.replace(/[\n|\r]*<br(\s)*(\/)*>/gi, "\n");

				// Video
				var videoWMV = function(str, p1)
				{
					var result = ' ';
					var rWmv = /showWMVPlayer.*?bx_wmv_player.*?file:[\s'"]*([^"']*).*?width:[\s'"]*([^"']*).*?height:[\s'"]*([^'"]*).*?/gi;
					var res = rWmv.exec(p1);
					if (res)
						result = "[VIDEO WIDTH="+res[2]+" HEIGHT="+res[3]+"]"+res[1]+"[/VIDEO]";
					if (result == ' ')
					{
						var rFlv = /bxPlayerOnload[\s\S]*?[\s'"]*file[\s'"]*:[\s'"]*([^"']*)[\s\S]*?[\s'"]*height[\s'"]*:[\s'"]*([^"']*)[\s\S]*?[\s'"]*width[\s'"]*:[\s'"]*([^"']*)/gi;
						res = rFlv.exec(p1);
						if (res)
							result = "[VIDEO WIDTH="+res[3]+" HEIGHT="+res[2]+"]"+res[1]+"[/VIDEO]";
					}
					return result;
				}

				selection = selection.replace(/<script[^>]*>/gi, '\001').replace(/<\/script[^>]*>/gi, '\002');
				selection = selection.replace(/\001([^\002]*)\002/gi, videoWMV)
				selection = selection.replace(/<noscript[^>]*>/gi, '\003').replace(/<\/noscript[^>]*>/gi, '\004');
				selection = selection.replace(/\003([^\004]*)\004/gi, " ");

				// Quote & Code & Table
				selection = selection.replace(/<table class\=[\"]*forum-quote[\"]*>[^<]*<thead>[^<]*<tr>[^<]*<th>([^<]+)<\/th><\/tr><\/thead>[^<]*<tbody>[^<]*<tr>[^<]*<td>/gi, "\001");
				selection = selection.replace(/<table class\=[\"]*forum-code[\"]*>[^<]*<thead>[^<]*<tr>[^<]*<th>([^<]+)<\/th><\/tr><\/thead>[^<]*<tbody>[^<]*<tr>[^<]*<td>/gi, "\002");
				selection = selection.replace(/<table class\=[\"]*data-table[\"]*>[^<]*<tbody>/gi, "\004");
				selection = selection.replace(/<\/td>[^<]*<\/tr>(<\/tbody>)*<\/table>/gi, "\003");
				selection = selection.replace(/[\r|\n]{2,}([\001|\002])/gi, "\n$1");

				var ii = 0;
				while(ii++ < 50 && (selection.search(/\002([^\002\003]*)\003/gi) >= 0 || selection.search(/\001([^\001\003]*)\003/gi) >= 0))
				{
					selection = selection.replace(/\002([^\002\003]*)\003/gi, "[CODE]$1[/CODE]").replace(/\001([^\001\003]*)\003/gi, "[QUOTE]$1[/QUOTE]");
				}

				var regexReplaceTableTag = function(s, tag, replacement)
				{
					var re_match = new RegExp("\004([^\004\003]*)("+tag+")([^\004\003]*)\003", "i");
					var re_replace = new RegExp("((?:\004)(?:[^\004\003]*))("+tag+")((?:[^\004\003]*)(?:\003))", "i");
					var ij = 0;
					while((ij++ < 300) && (s.search(re_match) >= 0))
						s = s.replace(re_replace, "$1"+replacement+"$3");
					return s;
				}

				ii = 0;
				while(ii++ < 10 && (selection.search(/\004([^\004\003]*)\003/gi) >= 0))
				{
					selection = regexReplaceTableTag(selection, "<tr>", "[TR]");
					selection = regexReplaceTableTag(selection, "<\/tr>", "[/TR]");
					selection = regexReplaceTableTag(selection, "<td>", "[TD]");
					selection = regexReplaceTableTag(selection, "<\/td>", "[/TD]");
					selection = selection.replace(/\004([^\004\003]*)\003/gi, "[TABLE]$1[/TD][/TR][/TABLE]");
				}

				// Smiles
				if (BX.browser.IsIE())
					selection = selection.replace(/<img(?:(?:\s+alt\s*=\s*\"?smile([^\"\s]+)\"?)|(?:\s+\w+\s*=\s*[^\s>]*))*>/gi, "$1");
				else
					selection = selection.replace(/<img.*?alt=[\"]*smile([^\"\s]+)[\"]*[^>]*>/gi, "$1");

				// Hrefs
				selection = selection.replace(/<a[^>]+href=[\"]([^\"]+)\"[^>]+>([^<]+)<\/a>/gi, "[URL=$1]$2[/URL]");
				selection = selection.replace(/<a[^>]+href=[\']([^\']+)\'[^>]+>([^<]+)<\/a>/gi, "[URL=$1]$2[/URL]");
				selection = selection.replace(/<[^>]+>/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, "\"");

				selection = selection.replace(/(smile(?=[:;8]))/g, "");

				selection = selection.replace(/\&shy;/gi, "");
				selection = selection.replace(/\&nbsp;/gi, " ");
				BX.onCustomEvent(this.form, 'onQuote', [{author : this.mess['m' + id]["author"], id : id, text : selection}]);
			}
			else if (act == 'reply') {
				BX.onCustomEvent(this.form, 'onReply', [{author : this.mess['m' + id]["author"], id : id}]);
			}
			else if (act == 'del' && (!confirm(BX.message('f_cdm')))) {
				BX.DoNothing();
			}
			else if (act == 'moderate' || act == 'del') {
				var
					link = BX.proxy_context,
					href = link.getAttribute("bx-href").replace(/.AJAX_CALL=Y/g,'').replace(/.sessid=[^&]*/g, ''),
					tbl = BX.findParent(link, {'tag' : 'table'}),
					note = BX.create('a', {attrs: { className : 'reply-action-note'}}),
					replyActionDone = function() {
						BX.remove(note);
						BX.show(link.parentNode);
					};

				BX.hide(link.parentNode);
				note.innerHTML = BX.message('f_wait');
				link.parentNode.parentNode.appendChild(note);
				BX.ajax.loadJSON(href,
					{AJAX_CALL : "Y", sessid : BX.bitrix_sessid()},
					BX.delegate(function(res) {
						if (res.status && !!tbl) {
							BX.onCustomEvent(window, 'onForumCommentAJAXAction', [act]);
							if (act == 'del') {
								var curpage = window["curpage"] || top.window.location.href;
								BX.fx.hide(tbl, 'scroll', {time: 0.15, callback_complete: BX.delegate(function() {
									BX.remove(tbl);
									replyActionDone();
									var reviews = BX.findChild(BX(this.form.id + 'container'), {'class': 'reviews-post-table'}, true, true);
									if ((!reviews) || (reviews.length < 1))
										if (this.params.pageNumber > 1)
											BX.reload(curpage);
								}, this)});
							} else {
								var bHidden = BX.hasClass(tbl, 'reviews-post-hidden');
								var label = (bHidden ? BX.message('f_hide') : BX.message('f_show'));
								var tbldiv = BX.findChild(tbl, { className : 'reviews-text'}, true);
								BX.fx.hide(tbldiv, 'fade', {time: 0.1, callback_complete: function() {
									BX.toggleClass(tbl, 'reviews-post-hidden');
									link.innerHTML = label;
									href = href.replace(new RegExp('REVIEW_ACTION='+(bHidden ? 'SHOW' : 'HIDE')), ('REVIEW_ACTION='+(bHidden ? 'HIDE' : 'SHOW')));
									link.setAttribute('bx-href', href);
									BX.fx.show(tbldiv, 'fade', {time: 0.1});
									replyActionDone();
									BX.style(tbldiv, 'background-color', (bHidden ? '#FFFFFF' : '#E5F8E3')); // IE9
								}});
							}
						} else {
							BX.addClass(note, 'error');
							note.innerHTML = '<span class="errortext">'+res.message+'</span>';
						}
					}, this)
				);
			}
			return false;
		}
	};

	window.FTRForm = function(params) {
		this.id = 'FTRForm' + params.form.id;
		this.form = params.form;
		this.editorName = params.editorName;
		this.editorId = params.editorId;
		this.editor = window[params.editorName];
		this.windowEvents = {};
		if (!this.editor)
		{
			this.windowEvents.LHE_OnInit = BX.delegate(function(pEditor) { if (pEditor.id == this.editorId) { this.addParsers(pEditor); this.editor = pEditor; } }, this);
			this.windowEvents.LHE_ConstructorInited = BX.delegate(function(pEditor) { if (pEditor.id == this.editorId) { if (!this.editor) { this.addParsers(pEditor); this.editor = pEditor; } this.editor.ucInited = true; } }, this);
			BX.addCustomEvent(window, 'LHE_OnInit', this.windowEvents.LHE_OnInit);
			BX.addCustomEvent(window, 'LHE_ConstructorInited', this.windowEvents.LHE_ConstructorInited);
		} else {
			this.addParsers(this.editor);
		}
		this.params = {
			messageMax : 64000
		};

		BX.addCustomEvent(this.form, 'onQuote', BX.delegate(function(params){this.show(); this.paste(params, 'QUOTE');}, this));
		BX.addCustomEvent(this.form, 'onReply', BX.delegate(function(params){this.show(); this.paste(params, 'REPLY');}, this));
	};
	window.FTRForm.prototype = {
		addParsers : function(pEditor)
		{
			pEditor.AddParser(
				{
					name: 'postuser',
					obj: {
						Parse: function(sName, sContent, pLEditor)
						{
							sContent = sContent.replace(/\[USER\s*=\s*(\d+)\]((?:\s|\S)*?)\[\/USER\]/ig, function(str, id, name)
							{
								id = parseInt(id);
								name = BX.util.trim(name);

								return '<span id="' + pLEditor.SetBxTag(false, {tag: "postuser", params: {value : id}}) +
									'" style="color: #2067B0; border-bottom: 1px dashed #2067B0;">' + name + '</span>';
							});
							return sContent;
						},
						UnParse: function(bxTag, pNode, pLEditor)
						{
							if (bxTag.tag == 'postuser')
							{
								var name = '';
								for (var i = 0; i < pNode.arNodes.length; i++)
									name += pLEditor._RecursiveGetHTML(pNode.arNodes[i]);
								name = BX.util.trim(name);
								return "[USER=" + bxTag.params.value + "]" + name +"[/USER]";
							}
							return "";
						}
					}
				}
			);
		},
		validate : function(ajax_post)
		{
			var form = this.form,
				errors = "",
				MessageLength = form.REVIEW_TEXT.value.length;
			if (form['BXFormSubmit_save'])
				return true; // ValidateForm may be run by BX.submit one more time

			if (form.TITLE && (form.TITLE.value.length < 2))
				errors += BX.message('no_topic_name');

			if (MessageLength < 2)
				errors += BX.message('no_message');
			else if ((this.params.messageMax !== 0) && (MessageLength > this.params.messageMax))
				errors += BX.message('max_len').replace(/\#MAX_LENGTH\#/gi, this.params.messageMax).replace(/\#LENGTH\#/gi, MessageLength);

			if (errors !== "")
			{
				alert(errors);
				return false;
			}

			var btnSubmit = BX.findChild(form, {'attribute':{'name':'send_button'}}, true);
			if (btnSubmit) { btnSubmit.disabled = true; }
			var btnPreview = BX.findChild(form, {'attribute':{'name':'view_button'}}, true);
			if (btnPreview) { btnPreview.disabled = true; }

			if (ajax_post == 'Y')
			{
				BX.onCustomEvent(window, 'onBeforeForumCommentAJAXPost', [form]);
				BX.onCustomEvent(this.form, 'onRequest', [this, ajax_post]);

				setTimeout(BX.delegate(function() { BX.ajax.submit(form, BX.delegate(this.get, this)); }, this), 50);
				return false;
			}
			return true;
		},
		get : function()
		{
			this.form['BXFormSubmit_save'] = null;
			var result = window.forumAjaxPostTmp;
			window["curpage"] = window["curpage"] || top.window.location.href;

			BX.onCustomEvent(window, 'onForumCommentAJAXPost', [result, this.form]);

			if (typeof result == 'undefined' || result.reload)
			{
				BX.reload(window["curpage"]);
				return;
			}

			if (result["status"])
			{
				if (!!result["allMessages"] || typeof result["message"] != 'undefined')
				{
					BX.onCustomEvent(this.form, 'onAdd', [result["messageID"], result]);
					this.clear();
				}
				else if (!!result["previewMessage"])
				{
					var previewDIV = BX.findChild(document, {'className': 'reviews-preview'}, true),
						previewParent = BX.findChild(document, {className : /reviews-reply-form|reviews-collapse/}, true).parentNode,
						previewNode = window.fTextToNode(result["previewMessage"]);
					window.fReplaceOrInsertNode(previewNode, previewDIV, previewParent, {'className' : /reviews-reply-form|reviews-collapse/});

					window.PostFormAjaxStatus('');
					window.fRunScripts(result["previewMessage"]);
				}
				var message = (!!result["messageID"] ? BX('message'+result["messageID"]) : null);
				if (message) {
					BX.scrollToNode(message);
				}
			}

			var arr = this.form.getElementsByTagName("input");
			for (var i=0; i < arr.length; i++)
			{
				var butt = arr[i];
				if (butt.getAttribute("type") == "submit")
					butt.disabled = false;
			}

			if (result["statusMessage"])
				window.PostFormAjaxStatus(result["statusMessage"]);

			BX.onCustomEvent(this.form, 'onResponse', [result, this.form]);
			BX.onCustomEvent(window, 'onAfterForumCommentAJAXPost', [result, this.form]);
		},
		clear : function()
		{
			this.editor.ReInit('');

			if (this.editor.fAutosave)
				BX.bind(this.editor.pEditorDocument, 'keydown',
					BX.proxy(this.editor.fAutosave.Init, this.editor.fAutosave));
			if (!BX.type.isDomNode(this.form)) return;
			var previewDIV = BX.findChild(document, {'className' : 'reviews-preview'}, true);
			if (previewDIV)
				BX.remove(previewDIV);

			var i = 0, fileDIV, fileINPUT, fileINPUT1;
			while ((fileDIV = BX('upload_files_'+(i++)+'_' + this.form.index.value)) && !!fileDIV)
			{
				if ((fileINPUT = BX.findChild(fileDIV, {'tag':'input'})) && !!fileINPUT1)
				{
					fileINPUT1 = BX.clone(fileINPUT);
					fileINPUT1.value = '';
					fileINPUT.parentNode.insertBefore(fileINPUT1, fileINPUT);
					fileINPUT.parentNode.removeChild(fileINPUT);
				}
				BX.hide(fileDIV);
			}
			var attachLink = BX.findChild(this.form, {'className':"forum-upload-file-attach"}, true);
			if (attachLink)
				BX.show(attachLink);
			var attachNote = BX.findChild(this.form, {'className':"reviews-upload-info"}, true);
			if (attachNote)
				BX.hide(attachNote);

			var captchaIMAGE = null,
				captchaHIDDEN = BX.findChild(this.form, {attr : {'name': 'captcha_code'}}, true),
				captchaINPUT = BX.findChild(this.form, {attr: {'name':'captcha_word'}}, true),
				captchaDIV = BX.findChild(this.form, {'className':'reviews-reply-field-captcha-image'}, true);
			if (captchaDIV)
				captchaIMAGE = BX.findChild(captchaDIV, {'tag':'img'});
			if (captchaHIDDEN && captchaINPUT && captchaIMAGE)
			{
				captchaINPUT.value = '';
				BX.ajax.getCaptcha(function(result) {
					captchaHIDDEN.value = result["captcha_sid"];
					captchaIMAGE.src = '/bitrix/tools/captcha.php?captcha_code='+result["captcha_sid"];
				});
			}
		},
		show : function()
		{
			BX.onCustomEvent(this.form, 'onBeforeShow', [this]);
			BX.show(this.form.parentNode);
			BX.scrollToNode(BX.findChild(this.form, {'attribute': { 'name' : 'send_button' }}, true));
			setTimeout(BX.delegate(function() {
				this.editor.SetFocus();
				BX.defer(this.editor.SetFocus, this.editor)();
			}, this), 100);
			BX.onCustomEvent(this.form, 'onAfterShow', [this]);
			return false;
		},
		hide : function()
		{
			BX.onCustomEvent(this.form, 'onBeforeHide', [this]);
			BX.hide(this.form.parentNode);
			BX.onCustomEvent(this.form, 'onAfterHide', [this]);
			return false;
		},
		transverse : function()
		{
			if (this.form.parentNode.style.display == 'none')
				this.show();
			else
				this.hide();
			return false;
		},
		paste : function(params, tag)
		{
			BX.onCustomEvent(this.form, 'onPaste', [params, tag, this]);
			var author = (!!params["author"] ? params["author"] : ''),
				text = (!!params["text"] ? params["text"] : ''),
				id = (!!params["id"] ? params["id"] : '');

			if (!author)
				author = '';
			else if (this.editor.sEditorMode == 'code' && this.editor.bBBCode) { // BB Codes
				if (author.id > 0)
					author = "[USER=" + author.id + "]" + author.name + "[/USER]";
				else
					author = author.name;
			} else if (this.editor.sEditorMode == 'html') { // WYSIWYG
				author.name = author.name.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
				if (author.id > 0)
					author = '<span id="' + this.editor.SetBxTag(false, {'tag': "postuser", 'params': {'value' : author.id}}) +
						'" style="color: #2067B0; border-bottom: 1px dashed #2067B0;">' + author.name + '</span>';
				else
					author = '<span>' + author.name + '</span>';
			}

			if (tag == "QUOTE")
			{
				if (this.editor.sEditorMode == 'code' && this.editor.bBBCode) { // BB Codes
					this.editor.WrapWith("[QUOTE" + (id > 0 ? (" ID=" + id) : "") + "]", "[/QUOTE]",
						(author !== '' ? ( author + BX.message("f_author") + "\n") : '') + text);
				} else if (this.editor.sEditorMode == 'html') { // WYSIWYG
					this.editor.InsertHTML('<blockquote class="bx-quote" id="mess' + id + '">' +
						(author !== '' ? ( author + BX.message("f_author") + '<br/>') : '') +
						this.editor.ParseContent(text, true) + "</blockquote><br/>");
				}
			}
			else
			{
				text = (!!author ? (author + ', ') : "") + this.editor.ParseContent(text, true);
				if (this.editor.sEditorMode == 'code' && this.editor.bBBCode) { // BB Codes
					this.editor.WrapWith("", "", text);
				} else if (this.editor.sEditorMode == 'html') { // WYSIWYG
					this.editor.InsertHTML(text);
				}
			}
			this.editor.SetFocus();
			BX.defer(this.editor.SetFocus, this.editor)();
		}
	};
	BX.ready(function() {
		if (BX.browser.IsIE())
		{
			var posts = BX.findChildren(document, {'className':'reviews-post-table'}, true), ii, all, i;
			if (!posts) return;
			for (ii = 0; ii < posts.length; ii++) {
				all = posts[ii].getElementsByTagName('*');
				i = all.length;
				while (i--) {
					if (all[i].scrollWidth > all[i].offsetWidth) {
						all[i].style['paddingBottom'] = '20px';
						all[i].style['overflowY'] = 'hidden';
					}
				}
			}
		}
	});

	window.fTextToNode = function(text)
	{
		var tmpdiv = BX.create('div');
		tmpdiv.innerHTML = text;
		if (tmpdiv.childNodes.length > 0)
			return tmpdiv;
		else
			return null;
	};

	window.PostFormAjaxStatus = function(status)
	{
		var arNote = BX.findChild(document, { className : 'reviews-note-box'} , true, true), i;
		if (arNote)
			for (i = 0; i <= arNote.length; i++)
				BX.remove(arNote[i]);

		var msgBox = BX.findChild(document, { className : 'reviews-block-container' } , true);
		if (!msgBox) return;

		if (status.length < 1) return;

		var statusDIV = window.fTextToNode(status);
		if (!statusDIV) return;

		var beforeDivs = ['reviews-reply-form', 'reviews-collapse'];
		var tmp = msgBox;
		while ((tmp = tmp.nextSibling) && !!tmp)
		{
			if (tmp.nodeType == 1)
			{
				var insert = false;
				for (i = 0; i < beforeDivs.length; i++)
				{
					if (BX.hasClass(tmp, beforeDivs[i]))
					{
						insert = true;
						break;
					}
				}
				if (insert)
				{
					tmp.parentNode.insertBefore(statusDIV, tmp);
					break;
				}
			}
		}
	};

	window.SetReviewsAjaxPostTmp = function(text)
	{
		window.forumAjaxPostTmp = text;
	};

	window.fReplaceOrInsertNode = function(sourceNode, targetNode, parentTargetNode, beforeTargetNode)
	{
		var nextNode = null;

		if (!BX.type.isDomNode(parentTargetNode)) return false;

		if (!BX.type.isDomNode(sourceNode) && !BX.type.isArray(sourceNode) && sourceNode.length > 0)
			if (! (sourceNode = window.fTextToNode(sourceNode))) return false;

		if (BX.type.isDomNode(targetNode)) // replace
		{
			parentTargetNode = targetNode.parentNode;
			nextNode = targetNode.nextSibling;
			parentTargetNode.removeChild(targetNode);
		}

		if (!nextNode)
			nextNode = BX.findChild(parentTargetNode, beforeTargetNode, true);

		if (nextNode)
		{
			nextNode.parentNode.insertBefore(sourceNode, nextNode);
		} else {
			parentTargetNode.appendChild(sourceNode);
		}

		return true;
	};

	window.fRunScripts = function(msg)
	{
		var ob = BX.processHTML(msg, true);
		BX.ajax.processScripts(ob.SCRIPT, true);
	};

	window.ShowLastEditReason = function(checked, div)
	{
		if (div)
		{
			if (checked)
				div.style.display = 'block';
			else
				div.style.display = 'none';
		}
	};

	window.AttachFile = function(iNumber, iCount, sIndex, oObj)
	{
		var element = null;
		var bFined = false;
		iNumber = parseInt(iNumber);
		iCount = parseInt(iCount);

		document.getElementById('upload_files_info_' + sIndex).style.display = 'block';
		for (var ii = iNumber; ii < (iNumber + iCount); ii++)
		{
			element = document.getElementById('upload_files_' + ii + '_' + sIndex);
			if (!element || typeof(element) === null)
				break;
			if (element.style.display == 'none')
			{
				bFined = true;
				element.style.display = 'block';
				break;
			}
		}
		var bHide = (!bFined ? true : (ii >= (iNumber + iCount - 1)));
		if (bHide === true)
			oObj.style.display = 'none';
	};

	/**
	 * @return {string}
	 */
	window.GetSelection = function()
	{
		var range, text = '';
		if (window.getSelection) {
			range = window.getSelection();
			text = range.toString();
		} else if (document.selection) {
			range = document.selection;
			text = range.createRange().text;
		}
		return text;
	}
})(window);

/* End */
;
; /* Start:"a:4:{s:4:"full";s:107:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.bigdata.products/main/script.min.js?145466930823411";s:6:"source";s:87:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.bigdata.products/main/script.js";s:3:"min";s:91:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.bigdata.products/main/script.min.js";s:3:"map";s:91:"/bitrix/templates/aspro_mshop/components/bitrix/catalog.bigdata.products/main/script.map.js";}"*/
(function(t){if(!!t.JCCatalogBigdataProducts){return}var e=function(t){e.superclass.constructor.apply(this,arguments);this.nameNode=BX.create("span",{props:{className:"bx_medium bx_bt_button",id:this.id},text:t.text});this.buttonNode=BX.create("span",{attrs:{className:t.ownerClass},style:{marginBottom:"0",borderBottom:"0 none transparent"},children:[this.nameNode],events:this.contextEvents});if(BX.browser.IsIE()){this.buttonNode.setAttribute("hideFocus","hidefocus")}};BX.extend(e,BX.PopupWindowButton);t.JCCatalogBigdataProducts=function(t){this.productType=0;this.showQuantity=true;this.showAbsent=true;this.secondPict=false;this.showOldPrice=false;this.showPercent=false;this.showSkuProps=false;this.visual={ID:"",PICT_ID:"",SECOND_PICT_ID:"",QUANTITY_ID:"",QUANTITY_UP_ID:"",QUANTITY_DOWN_ID:"",PRICE_ID:"",DSC_PERC:"",SECOND_DSC_PERC:"",DISPLAY_PROP_DIV:"",BASKET_PROP_DIV:""};this.product={checkQuantity:false,maxQuantity:0,stepQuantity:1,isDblQuantity:false,canBuy:true,canSubscription:true,name:"",pict:{},id:0,addUrl:"",buyUrl:""};this.basketData={useProps:false,emptyProps:false,quantity:"quantity",props:"prop",basketUrl:""};this.defaultPict={pict:null,secondPict:null};this.checkQuantity=false;this.maxQuantity=0;this.stepQuantity=1;this.isDblQuantity=false;this.canBuy=true;this.canSubscription=true;this.precision=6;this.precisionFactor=Math.pow(10,this.precision);this.offers=[];this.offerNum=0;this.treeProps=[];this.obTreeRows=[];this.showCount=[];this.showStart=[];this.selectedValues={};this.obProduct=null;this.obQuantity=null;this.obQuantityUp=null;this.obQuantityDown=null;this.obPict=null;this.obSecondPict=null;this.obPrice=null;this.obTree=null;this.obBuyBtn=null;this.obDscPerc=null;this.obSecondDscPerc=null;this.obSkuProps=null;this.obMeasure=null;this.obPopupWin=null;this.basketUrl="";this.basketParams={};this.treeRowShowSize=5;this.treeEnableArrow={display:"",cursor:"pointer",opacity:1};this.treeDisableArrow={display:"",cursor:"default",opacity:.2};this.lastElement=false;this.containerHeight=0;this.errorCode=0;if("object"===typeof t){this.productType=parseInt(t.PRODUCT_TYPE,10);this.showQuantity=t.SHOW_QUANTITY;this.showAbsent=t.SHOW_ABSENT;this.secondPict=!!t.SECOND_PICT;this.showOldPrice=!!t.SHOW_OLD_PRICE;this.showPercent=!!t.SHOW_DISCOUNT_PERCENT;this.showSkuProps=!!t.SHOW_SKU_PROPS;this.visual=t.VISUAL;switch(this.productType){case 1:case 2:if(!!t.PRODUCT&&"object"===typeof t.PRODUCT){if(this.showQuantity){this.product.checkQuantity=t.PRODUCT.CHECK_QUANTITY;this.product.isDblQuantity=t.PRODUCT.QUANTITY_FLOAT;if(this.product.checkQuantity){this.product.maxQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.MAX_QUANTITY):parseInt(t.PRODUCT.MAX_QUANTITY,10)}this.product.stepQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.STEP_QUANTITY):parseInt(t.PRODUCT.STEP_QUANTITY,10);this.checkQuantity=this.product.checkQuantity;this.isDblQuantity=this.product.isDblQuantity;this.maxQuantity=this.product.maxQuantity;this.stepQuantity=this.product.stepQuantity;if(this.isDblQuantity){this.stepQuantity=Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor}}this.product.canBuy=t.PRODUCT.CAN_BUY;this.product.canSubscription=t.PRODUCT.SUBSCRIPTION;this.canBuy=this.product.canBuy;this.canSubscription=this.product.canSubscription;this.product.name=t.PRODUCT.NAME;this.product.pict=t.PRODUCT.PICT;this.product.id=t.PRODUCT.ID;if(!!t.PRODUCT.ADD_URL){this.product.addUrl=t.PRODUCT.ADD_URL}if(!!t.PRODUCT.BUY_URL){this.product.buyUrl=t.PRODUCT.BUY_URL}if(!!t.BASKET&&"object"===typeof t.BASKET){this.basketData.useProps=!!t.BASKET.ADD_PROPS;this.basketData.emptyProps=!!t.BASKET.EMPTY_PROPS}}else{this.errorCode=-1}break;case 3:if(!!t.OFFERS&&BX.type.isArray(t.OFFERS)){if(!!t.PRODUCT&&"object"===typeof t.PRODUCT){this.product.name=t.PRODUCT.NAME;this.product.id=t.PRODUCT.ID}this.offers=t.OFFERS;this.offerNum=0;if(!!t.OFFER_SELECTED){this.offerNum=parseInt(t.OFFER_SELECTED,10)}if(isNaN(this.offerNum)){this.offerNum=0}if(!!t.TREE_PROPS){this.treeProps=t.TREE_PROPS}if(!!t.DEFAULT_PICTURE){this.defaultPict.pict=t.DEFAULT_PICTURE.PICTURE;this.defaultPict.secondPict=t.DEFAULT_PICTURE.PICTURE_SECOND}}else{this.errorCode=-1}break;default:this.errorCode=-1}if(!!t.BASKET&&"object"===typeof t.BASKET){if(!!t.BASKET.QUANTITY){this.basketData.quantity=t.BASKET.QUANTITY}if(!!t.BASKET.PROPS){this.basketData.props=t.BASKET.PROPS}if(!!t.BASKET.BASKET_URL){this.basketData.basketUrl=t.BASKET.BASKET_URL}}this.lastElement=!!t.LAST_ELEMENT&&"Y"===t.LAST_ELEMENT}if(0===this.errorCode){BX.ready(BX.delegate(this.Init,this))}};t.JCCatalogBigdataProducts.prototype.Init=function(){var e=0,i="",s=null;this.obProduct=BX(this.visual.ID);if(!this.obProduct){this.errorCode=-1}this.obPict=BX(this.visual.PICT_ID);if(!this.obPict){this.errorCode=-2}if(this.secondPict&&!!this.visual.SECOND_PICT_ID){this.obSecondPict=BX(this.visual.SECOND_PICT_ID)}this.obPrice=BX(this.visual.PRICE_ID);if(!this.obPrice){this.errorCode=-16}if(this.showQuantity&&!!this.visual.QUANTITY_ID){this.obQuantity=BX(this.visual.QUANTITY_ID);if(!!this.visual.QUANTITY_UP_ID){this.obQuantityUp=BX(this.visual.QUANTITY_UP_ID)}if(!!this.visual.QUANTITY_DOWN_ID){this.obQuantityDown=BX(this.visual.QUANTITY_DOWN_ID)}}if(3===this.productType){if(!!this.visual.TREE_ID){this.obTree=BX(this.visual.TREE_ID);if(!this.obTree){this.errorCode=-256}i=this.visual.TREE_ITEM_ID;for(e=0;e<this.treeProps.length;e++){this.obTreeRows[e]={LEFT:BX(i+this.treeProps[e].ID+"_left"),RIGHT:BX(i+this.treeProps[e].ID+"_right"),LIST:BX(i+this.treeProps[e].ID+"_list"),CONT:BX(i+this.treeProps[e].ID+"_cont")};if(!this.obTreeRows[e].LEFT||!this.obTreeRows[e].RIGHT||!this.obTreeRows[e].LIST||!this.obTreeRows[e].CONT){this.errorCode=-512;break}}}if(!!this.visual.QUANTITY_MEASURE){this.obMeasure=BX(this.visual.QUANTITY_MEASURE)}}if(!!this.visual.BUY_ID){this.obBuyBtn=BX(this.visual.BUY_ID)}if(this.showPercent){if(!!this.visual.DSC_PERC){this.obDscPerc=BX(this.visual.DSC_PERC)}if(this.secondPict&&!!this.visual.SECOND_DSC_PERC){this.obSecondDscPerc=BX(this.visual.SECOND_DSC_PERC)}}if(this.showSkuProps){if(!!this.visual.DISPLAY_PROP_DIV){this.obSkuProps=BX(this.visual.DISPLAY_PROP_DIV)}}if(0===this.errorCode){if(this.showQuantity){if(!!this.obQuantityUp){BX.bind(this.obQuantityUp,"click",BX.delegate(this.QuantityUp,this))}if(!!this.obQuantityDown){BX.bind(this.obQuantityDown,"click",BX.delegate(this.QuantityDown,this))}if(!!this.obQuantity){BX.bind(this.obQuantity,"change",BX.delegate(this.QuantityChange,this))}}switch(this.productType){case 1:break;case 3:s=BX.findChildren(this.obTree,{tagName:"li"},true);if(!!s&&0<s.length){for(e=0;e<s.length;e++){BX.bind(s[e],"click",BX.delegate(this.SelectOfferProp,this))}}for(e=0;e<this.obTreeRows.length;e++){BX.bind(this.obTreeRows[e].LEFT,"click",BX.delegate(this.RowLeft,this));BX.bind(this.obTreeRows[e].RIGHT,"click",BX.delegate(this.RowRight,this))}this.SetCurrent();break}if(!!this.obBuyBtn){BX.bind(this.obBuyBtn,"click",BX.delegate(this.Basket,this))}if(this.lastElement){this.containerHeight=parseInt(this.obProduct.parentNode.offsetHeight,10);if(isNaN(this.containerHeight)){this.containerHeight=0}this.setHeight();BX.bind(t,"resize",BX.delegate(this.checkHeight,this));BX.bind(this.obProduct.parentNode,"mouseover",BX.delegate(this.setHeight,this));BX.bind(this.obProduct.parentNode,"mouseout",BX.delegate(this.clearHeight,this))}}};t.JCCatalogBigdataProducts.prototype.checkHeight=function(){this.containerHeight=parseInt(this.obProduct.parentNode.offsetHeight,10);if(isNaN(this.containerHeight)){this.containerHeight=0}};t.JCCatalogBigdataProducts.prototype.setHeight=function(){if(0<this.containerHeight){BX.adjust(this.obProduct.parentNode,{style:{height:this.containerHeight+"px"}})}};t.JCCatalogBigdataProducts.prototype.clearHeight=function(){BX.adjust(this.obProduct.parentNode,{style:{height:"auto"}})};t.JCCatalogBigdataProducts.prototype.QuantityUp=function(){var t=0,e=true;if(0===this.errorCode&&this.showQuantity&&this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10);if(!isNaN(t)){t+=this.stepQuantity;if(this.checkQuantity){if(t>this.maxQuantity){e=false}}if(e){if(this.isDblQuantity){t=Math.round(t*this.precisionFactor)/this.precisionFactor}this.obQuantity.value=t}}}};t.JCCatalogBigdataProducts.prototype.QuantityDown=function(){var t=0,e=true;if(0===this.errorCode&&this.showQuantity&&this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10);if(!isNaN(t)){t-=this.stepQuantity;if(t<this.stepQuantity){e=false}if(e){if(this.isDblQuantity){t=Math.round(t*this.precisionFactor)/this.precisionFactor}this.obQuantity.value=t}}}};t.JCCatalogBigdataProducts.prototype.QuantityChange=function(){var t=0,e=true;if(0===this.errorCode&&this.showQuantity){if(this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10);if(!isNaN(t)){if(this.checkQuantity){if(t>this.maxQuantity){e=false;t=this.maxQuantity}else if(t<this.stepQuantity){e=false;t=this.stepQuantity}}if(!e){this.obQuantity.value=t}}else{this.obQuantity.value=this.stepQuantity}}else{this.obQuantity.value=this.stepQuantity}}};t.JCCatalogBigdataProducts.prototype.QuantitySet=function(t){if(0===this.errorCode){this.canBuy=this.offers[t].CAN_BUY;if(this.canBuy){BX.addClass(this.obBuyBtn,"bx_bt_button");BX.removeClass(this.obBuyBtn,"bx_bt_button_type_2");this.obBuyBtn.innerHTML=BX.message("CBD_MESS_BTN_BUY")}else{BX.addClass(this.obBuyBtn,"bx_bt_button_type_2");BX.removeClass(this.obBuyBtn,"bx_bt_button");this.obBuyBtn.innerHTML=BX.message("CBD_MESS_NOT_AVAILABLE")}if(this.showQuantity){this.isDblQuantity=this.offers[t].QUANTITY_FLOAT;this.checkQuantity=this.offers[t].CHECK_QUANTITY;if(this.isDblQuantity){this.maxQuantity=parseFloat(this.offers[t].MAX_QUANTITY);this.stepQuantity=Math.round(parseFloat(this.offers[t].STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor}else{this.maxQuantity=parseInt(this.offers[t].MAX_QUANTITY,10);this.stepQuantity=parseInt(this.offers[t].STEP_QUANTITY,10)}this.obQuantity.value=this.stepQuantity;this.obQuantity.disabled=!this.canBuy;if(!!this.obMeasure){if(!!this.offers[t].MEASURE){BX.adjust(this.obMeasure,{html:this.offers[t].MEASURE})}else{BX.adjust(this.obMeasure,{html:""})}}}}};t.JCCatalogBigdataProducts.prototype.SelectOfferProp=function(){var t=0,e="",i="",s=[],a=null,o=BX.proxy_context;if(!!o&&o.hasAttribute("data-treevalue")){i=o.getAttribute("data-treevalue");s=i.split("_");if(this.SearchOfferPropIndex(s[0],s[1])){a=BX.findChildren(o.parentNode,{tagName:"li"},false);if(!!a&&0<a.length){for(t=0;t<a.length;t++){e=a[t].getAttribute("data-onevalue");if(e===s[1]){BX.addClass(a[t],"bx_active")}else{BX.removeClass(a[t],"bx_active")}}}}}};t.JCCatalogBigdataProducts.prototype.SearchOfferPropIndex=function(t,e){var i="",s=false,a,o,r=[],h=-1,n={},u=[];for(a=0;a<this.treeProps.length;a++){if(this.treeProps[a].ID===t){h=a;break}}if(-1<h){for(a=0;a<h;a++){i="PROP_"+this.treeProps[a].ID;n[i]=this.selectedValues[i]}i="PROP_"+this.treeProps[h].ID;s=this.GetRowValues(n,i);if(!s){return false}if(!BX.util.in_array(e,s)){return false}n[i]=e;for(a=h+1;a<this.treeProps.length;a++){i="PROP_"+this.treeProps[a].ID;s=this.GetRowValues(n,i);if(!s){return false}if(this.showAbsent){r=[];u=[];u=BX.clone(n,true);for(o=0;o<s.length;o++){u[i]=s[o];if(this.GetCanBuy(u)){r[r.length]=s[o]}}}else{r=s}if(!!this.selectedValues[i]&&BX.util.in_array(this.selectedValues[i],r)){n[i]=this.selectedValues[i]}else{n[i]=r[0]}this.UpdateRow(a,n[i],s,r)}this.selectedValues=n;this.ChangeInfo()}return true};t.JCCatalogBigdataProducts.prototype.RowLeft=function(){var t=0,e="",i=-1,s=BX.proxy_context;if(!!s&&s.hasAttribute("data-treevalue")){e=s.getAttribute("data-treevalue");for(t=0;t<this.treeProps.length;t++){if(this.treeProps[t].ID===e){i=t;break}}if(-1<i&&this.treeRowShowSize<this.showCount[i]){if(0>this.showStart[i]){this.showStart[i]++;BX.adjust(this.obTreeRows[i].LIST,{style:{marginLeft:this.showStart[i]*20+"%"}});BX.adjust(this.obTreeRows[i].RIGHT,{style:this.treeEnableArrow})}if(0<=this.showStart[i]){BX.adjust(this.obTreeRows[i].LEFT,{style:this.treeDisableArrow})}}}};t.JCCatalogBigdataProducts.prototype.RowRight=function(){var t=0,e="",i=-1,s=BX.proxy_context;if(!!s&&s.hasAttribute("data-treevalue")){e=s.getAttribute("data-treevalue");for(t=0;t<this.treeProps.length;t++){if(this.treeProps[t].ID===e){i=t;break}}if(-1<i&&this.treeRowShowSize<this.showCount[i]){if(this.treeRowShowSize-this.showStart[i]<this.showCount[i]){this.showStart[i]--;BX.adjust(this.obTreeRows[i].LIST,{style:{marginLeft:this.showStart[i]*20+"%"}});BX.adjust(this.obTreeRows[i].LEFT,{style:this.treeEnableArrow})}if(this.treeRowShowSize-this.showStart[i]>=this.showCount[i]){BX.adjust(this.obTreeRows[i].RIGHT,{style:this.treeDisableArrow})}}}};t.JCCatalogBigdataProducts.prototype.UpdateRow=function(t,e,i,s){var a=0,o=0,r="",h=0,n="",u={},l=false,c=false,f=false,p=0,d=this.treeEnableArrow,b=this.treeEnableArrow,P=0,B=null;if(-1<t&&t<this.obTreeRows.length){B=BX.findChildren(this.obTreeRows[t].LIST,{tagName:"li"},false);if(!!B&&0<B.length){l="PICT"===this.treeProps[t].SHOW_MODE;h=i.length;c=this.treeRowShowSize<h;n=c?100/h+"%":"20%";u={props:{className:""},style:{width:n}};if(l){u.style.paddingTop=n}for(a=0;a<B.length;a++){r=B[a].getAttribute("data-onevalue");f=r===e;if(BX.util.in_array(r,s)){u.props.className=f?"bx_active":""}else{u.props.className=f?"bx_active bx_missing":"bx_missing"}u.style.display="none";if(BX.util.in_array(r,i)){u.style.display="";if(f){p=o}o++}BX.adjust(B[a],u)}u={style:{width:(c?20*h:100)+"%",marginLeft:"0%"}};if(l){BX.adjust(this.obTreeRows[t].CONT,{props:{className:c?"bx_item_detail_scu full":"bx_item_detail_scu"}})}else{BX.adjust(this.obTreeRows[t].CONT,{props:{className:c?"bx_item_detail_size full":"bx_item_detail_size"}})}if(c){if(p+1===h){b=this.treeDisableArrow}if(this.treeRowShowSize<=p){P=this.treeRowShowSize-p-1;u.style.marginLeft=P*20+"%"}if(0===P){d=this.treeDisableArrow}BX.adjust(this.obTreeRows[t].LEFT,{style:d});BX.adjust(this.obTreeRows[t].RIGHT,{style:b})}else{BX.adjust(this.obTreeRows[t].LEFT,{style:{display:"none"}});BX.adjust(this.obTreeRows[t].RIGHT,{style:{display:"none"}})}BX.adjust(this.obTreeRows[t].LIST,u);this.showCount[t]=h;this.showStart[t]=P}}};t.JCCatalogBigdataProducts.prototype.GetRowValues=function(t,e){var i=0,s,a=[],o=false,r=true;if(0===t.length){for(i=0;i<this.offers.length;i++){if(!BX.util.in_array(this.offers[i].TREE[e],a)){a[a.length]=this.offers[i].TREE[e]}}o=true}else{for(i=0;i<this.offers.length;i++){r=true;for(s in t){if(t[s]!==this.offers[i].TREE[s]){r=false;break}}if(r){if(!BX.util.in_array(this.offers[i].TREE[e],a)){a[a.length]=this.offers[i].TREE[e]}o=true}}}return o?a:false};t.JCCatalogBigdataProducts.prototype.GetCanBuy=function(t){var e=0,i,s=false,a=true;for(e=0;e<this.offers.length;e++){a=true;for(i in t){if(t[i]!==this.offers[e].TREE[i]){a=false;break}}if(a){if(this.offers[e].CAN_BUY){s=true;break}}}return s};t.JCCatalogBigdataProducts.prototype.SetCurrent=function(){var t=0,e=0,i=[],s="",a=false,o={},r=[],h=this.offers[this.offerNum].TREE;for(t=0;t<this.treeProps.length;t++){s="PROP_"+this.treeProps[t].ID;a=this.GetRowValues(o,s);if(!a){break}if(BX.util.in_array(h[s],a)){o[s]=h[s]}else{o[s]=a[0];this.offerNum=0}if(this.showAbsent){i=[];r=[];r=BX.clone(o,true);for(e=0;e<a.length;e++){r[s]=a[e];if(this.GetCanBuy(r)){i[i.length]=a[e]}}}else{i=a}this.UpdateRow(t,o[s],a,i)}this.selectedValues=o;this.ChangeInfo()};t.JCCatalogBigdataProducts.prototype.ChangeInfo=function(){var t=0,e,i=-1,s={},a=true,o="";for(t=0;t<this.offers.length;t++){a=true;for(e in this.selectedValues){if(this.selectedValues[e]!==this.offers[t].TREE[e]){a=false;break}}if(a){i=t;break}}if(-1<i){if(!!this.obPict){if(!!this.offers[i].PREVIEW_PICTURE){BX.adjust(this.obPict,{style:{backgroundImage:"url("+this.offers[i].PREVIEW_PICTURE.SRC+")"}})}else{BX.adjust(this.obPict,{style:{backgroundImage:"url("+this.defaultPict.pict.SRC+")"}})}}if(this.secondPict&&!!this.obSecondPict){if(!!this.offers[i].PREVIEW_PICTURE_SECOND){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url("+this.offers[i].PREVIEW_PICTURE_SECOND.SRC+")"}})}else if(!!this.offers[i].PREVIEW_PICTURE.SRC){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url("+this.offers[i].PREVIEW_PICTURE.SRC+")"}})}else if(!!this.defaultPict.secondPict){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url("+this.defaultPict.secondPict.SRC+")"}})}else{BX.adjust(this.obSecondPict,{style:{backgroundImage:"url("+this.defaultPict.pict.SRC+")"}})}}if(this.showSkuProps&&!!this.obSkuProps){if(0===this.offers[i].DISPLAY_PROPERTIES.length){BX.adjust(this.obSkuProps,{style:{display:"none"},html:""})}else{BX.adjust(this.obSkuProps,{style:{display:""},html:this.offers[i].DISPLAY_PROPERTIES})}}if(!!this.obPrice){o=this.offers[i].PRICE.PRINT_DISCOUNT_VALUE;if(this.showOldPrice&&this.offers[i].PRICE.DISCOUNT_VALUE!==this.offers[i].PRICE.VALUE){o+=" <span>"+this.offers[i].PRICE.PRINT_VALUE+"</span>"}BX.adjust(this.obPrice,{html:o});if(this.showPercent){if(this.offers[i].PRICE.DISCOUNT_VALUE!==this.offers[i].PRICE.VALUE){s={style:{display:""},html:this.offers[i].PRICE.DISCOUNT_DIFF_PERCENT}}else{s={style:{display:"none"},html:""}}if(!!this.obDscPerc){BX.adjust(this.obDscPerc,s)}if(!!this.obSecondDscPerc){BX.adjust(this.obSecondDscPerc,s)}}}this.offerNum=i;this.QuantitySet(this.offerNum)}};t.JCCatalogBigdataProducts.prototype.InitBasketUrl=function(){switch(this.productType){case 1:case 2:this.basketUrl=this.product.addUrl;break;case 3:this.basketUrl=this.offers[this.offerNum].ADD_URL;break}this.basketParams={ajax_basket:"Y",rcm:"yes"};if(this.showQuantity){this.basketParams[this.basketData.quantity]=this.obQuantity.value}};t.JCCatalogBigdataProducts.prototype.FillBasketProps=function(){if(!this.visual.BASKET_PROP_DIV){return}var t=0,e=null,i=false,s=null;if(this.basketData.useProps&&!this.basketData.emptyProps){if(!!this.obPopupWin&&!!this.obPopupWin.contentContainer){s=this.obPopupWin.contentContainer}}else{s=BX(this.visual.BASKET_PROP_DIV)}if(!s){return}e=s.getElementsByTagName("select");if(!!e&&!!e.length){for(t=0;t<e.length;t++){if(!e[t].disabled){switch(e[t].type.toLowerCase()){case"select-one":this.basketParams[e[t].name]=e[t].value;i=true;break;default:break}}}}e=s.getElementsByTagName("input");if(!!e&&!!e.length){for(t=0;t<e.length;t++){if(!e[t].disabled){switch(e[t].type.toLowerCase()){case"hidden":this.basketParams[e[t].name]=e[t].value;i=true;break;case"radio":if(e[t].checked){this.basketParams[e[t].name]=e[t].value;i=true}break;default:break}}}}if(!i){this.basketParams[this.basketData.props]=[];this.basketParams[this.basketData.props][0]=0}};t.JCCatalogBigdataProducts.prototype.SendToBasket=function(){if(!this.canBuy){return}this.InitBasketUrl();this.FillBasketProps();if(this.product&&this.product.id){this.RememberRecommendation(this.obProduct,this.product.id)}BX.ajax({method:"POST",dataType:"json",url:this.basketUrl,data:this.basketParams,onsuccess:BX.delegate(this.BasketResult,this)})};t.JCCatalogBigdataProducts.prototype.RememberRecommendation=function(t,e){var i=BX.findParent(t,{className:"bigdata_recommended_products_items"});var s=BX.findChild(i,{attr:{name:"bigdata_recommendation_id"}},true).value;var a=BX.cookie_prefix+"_RCM_PRODUCT_LOG";var o=getCookie(a);var r=false;var h=[],n;if(o){h=o.split(".")}var u=h.length;while(u--){n=h[u].split("-");if(n[0]==e){n=h[u].split("-");n[1]=s;n[2]=BX.current_server_time;h[u]=n.join("-");r=true}else{if(BX.current_server_time-n[2]>3600*24*30){h.splice(u,1)}}}if(!r){h.push([e,s,BX.current_server_time].join("-"))}var l=h.join(".");var c=new Date((new Date).getTime()+1e3*3600*24*365*10);document.cookie=a+"="+l+"; path=/; expires="+c.toUTCString()+"; domain="+BX.cookie_domain};t.JCCatalogBigdataProducts.prototype.Basket=function(){var t="";if(!this.canBuy){return}switch(this.productType){case 1:case 2:if(this.basketData.useProps&&!this.basketData.emptyProps){this.InitPopupWindow();this.obPopupWin.setTitleBar({content:BX.create("div",{style:{marginRight:"30px",whiteSpace:"nowrap"},text:BX.message("CBD_TITLE_BASKET_PROPS")})});if(BX(this.visual.BASKET_PROP_DIV)){t=BX(this.visual.BASKET_PROP_DIV).innerHTML}this.obPopupWin.setContent(t);this.obPopupWin.setButtons([new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CBD_BTN_MESSAGE_SEND_PROPS"),events:{click:BX.delegate(this.SendToBasket,this)}})]);this.obPopupWin.show()}else{this.SendToBasket()}break;case 3:this.SendToBasket();break}};t.JCCatalogBigdataProducts.prototype.BasketResult=function(t){var i="",s="",a="",o=true,r=[];if(!!this.obPopupWin){this.obPopupWin.close()}if("object"!==typeof t){return false}o="OK"===t.STATUS;if(o){BX.onCustomEvent("OnBasketChange");s=this.product.name;switch(this.productType){case 1:case 2:a=this.product.pict.SRC;break;case 3:a=!!this.offers[this.offerNum].PREVIEW_PICTURE?this.offers[this.offerNum].PREVIEW_PICTURE.SRC:this.defaultPict.pict.SRC;break}i='<div style="width: 96%; margin: 10px 2%; text-align: center;"><img src="'+a+'" height="130"><p>'+s+"</p></div>";r=[new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CBD_BTN_MESSAGE_BASKET_REDIRECT"),events:{click:BX.delegate(function(){location.href=!!this.basketData.basketUrl?this.basketData.basketUrl:BX.message("BASKET_URL")},this)}})]}else{i=!!t.MESSAGE?t.MESSAGE:BX.message("CBD_BASKET_UNKNOWN_ERROR");r=[new e({ownerClass:this.obProduct.parentNode.parentNode.parentNode.className,text:BX.message("CBD_BTN_MESSAGE_CLOSE"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})]}this.InitPopupWindow();this.obPopupWin.setTitleBar({content:BX.create("div",{style:{marginRight:"30px",whiteSpace:"nowrap"},text:o?BX.message("CBD_TITLE_SUCCESSFUL"):BX.message("CBD_TITLE_ERROR")})});this.obPopupWin.setContent(i);this.obPopupWin.setButtons(r);this.obPopupWin.show()};t.JCCatalogBigdataProducts.prototype.InitPopupWindow=function(){if(!!this.obPopupWin){return}this.obPopupWin=BX.PopupWindowManager.create("CatalogSectionBasket_"+this.visual.ID,null,{autoHide:false,offsetLeft:0,offsetTop:0,overlay:true,closeByEsc:true,titleBar:true,closeIcon:{top:"10px",right:"10px"}})}})(window);function getCookie(t){var e=document.cookie.match(new RegExp("(?:^|; )"+t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return e?decodeURIComponent(e[1]):undefined}function bx_rcm_recommendation_event_attaching(t){var e=BX.findChildren(t,{className:"bx_rcm_view_link"},true);if(e){for(i in e){BX.bind(e[i],"click",function(t){window.JCCatalogBigdataProducts.prototype.RememberRecommendation(BX(this),BX(this).getAttribute("data-product-id"))})}}}function bx_rcm_get_from_cloud(t,e,i){var s="https://analytics.bitrix.info/crecoms/v1_0/recoms.php";var a=BX.ajax.prepareData(e);if(a){s+=(s.indexOf("?")!==-1?"&":"?")+a;a=""}var o=function(e){if(!e.items){e.items=[]}BX.ajax({url:"/bitrix/components/bitrix/catalog.bigdata.products/ajax.php?"+BX.ajax.prepareData({AJAX_ITEMS:e.items,RID:e.id}),method:"POST",data:i,dataType:"html",processData:false,start:true,onsuccess:function(e){var i=BX.processHTML(e);BX(t).innerHTML=i.HTML;BX.ajax.processScripts(i.SCRIPT)}})};BX.ajax({method:"GET",dataType:"json",url:s,timeout:3,onsuccess:o,onfailure:o})}
/* End */
;; /* /bitrix/templates/aspro_mshop/components/bitrix/catalog.element/main/script.js?145940620978542*/
; /* /bitrix/templates/aspro_mshop/components/bitrix/forum.topic.reviews/main/script.js?145466930825926*/
; /* /bitrix/templates/aspro_mshop/components/bitrix/catalog.bigdata.products/main/script.min.js?145466930823411*/

//# sourceMappingURL=page_cf41996ba5b760080b3ad0a665662b6b.map.js