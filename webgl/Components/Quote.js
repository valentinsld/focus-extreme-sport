import {Object3D, Group, Vector3} from 'three'
// import RAFManager from '../Utils/RAFManager.js'

import FontAtlas from '~~/assets/MSDFfonts/roboto-regular.png'
import FontFNT from '~~/assets/MSDFfonts/roboto-regular.json'

import GothamAtlas from '~~/assets/MSDFfonts/Gotham-BookItalic.png'
import GothamFNT from '~~/assets/MSDFfonts/Gotham-BookItalic.json'

import AkiraAtlas from '~~/assets/MSDFfonts/AkiraSuperBold.png'
import AkiraFNT from '~~/assets/MSDFfonts/AkiraSuperBold.json'

import WebGL from '../index.js'
import MSDFText from './MSDFText.js'

export default class QuoteBlock {

	constructor(_options = {}) {
	  this.webgl = new WebGL()
	  this.container = new Object3D
	  this.container.name = 'Quote Block'

	  this.contentWidth = _options.contentWidth || 500
	  this.authorWidth = _options.authorWidth || 500
	  this.jobWidth = _options.jobWidth || 500

	  this.contentAlign = _options.contentAlign || 'left'
	  this.authorAlign = _options.authorAlign || 'left'
	  this.jobAlign = _options.jobAlign || 'left'

	  this.quoteContent = _options.quoteContent || 'Test text'
	  this.quoteAuthor = _options.quoteAuthor || 'Margaux Clement'
	  this.quoteJob = _options.quoteJob || 'Kayakiste Professionnelle'

	  this.contentLetterSpacing = _options.contentLetterSpacing || 0
	  this.authorLetterSpacing = _options.authorLetterSpacing || 0
	  this.jobLetterSpacing = _options.jobLetterSpacing || 0

	  this.contentLineHeight = _options.contentLineHeight || 0
	  this.authorLineHeight = _options.authorLineHeight || 0
	  this.jobLineHeight = _options.jobLineHeight || 0

	  this.init()
	}

	init() {

		this.infos = new Group()

		this.content = new MSDFText({
			font: GothamFNT,
			atlas: GothamAtlas,
			text: this.quoteContent,
			lineHeight: this.contentLineHeight,
			width: this.contentWidth,
			align: this.contentAlign,
		  });

		this.author = new MSDFText({
			font: AkiraFNT,
			atlas: AkiraAtlas,
			text: this.quoteAuthor,
		})

		this.infos.add(this.author.container)

		this.container.add(...[this.content.container, this.infos])
	}
}
