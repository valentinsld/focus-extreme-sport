import {Object3D} from 'three'
// import RAFManager from '../Utils/RAFManager.js'

import GothamItalicAtlas from '~~/assets/MSDFfonts/Gotham-BookItalic.png'
import GothamItalicFNT from '~~/assets/MSDFfonts/Gotham-BookItalic.json'

import GothamAtlas from '~~/assets/MSDFfonts/Gotham-Book.png'
import GothamFNT from '~~/assets/MSDFfonts/Gotham-Book.json'

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
	  this.quoteAuthor = _options.quoteAuthor || 'MARGAUX CLEMENT'
	  this.quoteJob = _options.quoteJob || 'Kayakiste Professionnelle'

	  this.contentLetterSpacing = _options.contentLetterSpacing || 0
	  this.authorLetterSpacing = _options.authorLetterSpacing || 0
	  this.jobLetterSpacing = _options.jobLetterSpacing || 0

	  this.contentLineHeight = _options.contentLineHeight || 0
	  this.authorLineHeight = _options.authorLineHeight || 0
	  this.jobLineHeight = _options.jobLineHeight || 0

	  this.contentColor = _options.contentColor || '#ffffff'
	  this.authorColor = _options.authorColor || '#ffffff'
	  this.jobColor = _options.jobColor || '#ffffff'

	  this.init()
	}

	async init() {

		this.infos = new Object3D()

		this.content = new MSDFText({
			font: GothamItalicFNT,
			atlas: GothamItalicAtlas,
			text: this.quoteContent,
			lineHeight: this.contentLineHeight,
			width: this.contentWidth,
			align: this.contentAlign,
			color: this.contentColor
			// isSmall: true,
		  });

		this.author = new MSDFText({
			font: AkiraFNT,
			atlas: AkiraAtlas,
			text: this.quoteAuthor,
			align: this.authorAlign,
			lineHeight: this.authorLineHeight,
			width: this.authorWidth,
			color: this.authorColor
		})

		this.job = new MSDFText({
			font: GothamFNT,
			atlas: GothamAtlas,
			text: this.quoteJob,
			lineHeight: this.jobLineHeight,
			width: this.jobWidth,
			align: this.jobAlign,
			color: this.jobColor
			// isSmall: true,
		})

		this.infos.position.y = -80
		this.job.container.position.y = -40

		this.infos.add(...[this.author.container, this.job.container])

		this.container.add(...[this.content.container, this.infos])
		this.container.visible = false
	}

	hideQuote() {
		this.container.visible = false
	}

	showQuote() {
		this.container.visible = true
	}
}
