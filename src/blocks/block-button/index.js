/**
 * BLOCK: Atomic Blocks Button
 */

// Import block dependencies and components
import classnames from 'classnames';
import Inspector from './components/inspector';
import CustomButton from './components/button';
import icons from './components/icons';

// Import CSS
import './styles/style.scss';
import './styles/editor.scss';

// Components
const { __ } = wp.i18n; 

// Extend component
const { Component } = wp.element;

// Register block controls
const { 
	registerBlockType,
	RichText,
	AlignmentToolbar,
	BlockControls,
	BlockAlignmentToolbar,
	UrlInput,
} = wp.blocks;

// Register components
const {
	Button,
	withFallbackStyles,
	IconButton,
	Dashicon,
} = wp.components;

class ABButtonBlock extends Component {
	
	render() {
		const { isSelected, className, setAttributes } = this.props;
		const { buttonText, buttonUrl, buttonAlignment, buttonBackgroundColor, buttonTextColor, buttonSize, buttonShape, buttonTarget } = this.props.attributes;
		
		// Button size values
		const buttonSizeOptions = [
			{ value: 'button-size-small', label: __( 'Small' ) },
			{ value: 'button-size-medium', label: __( 'Medium' ) },
			{ value: 'button-size-large', label: __( 'Large' ) },
			{ value: 'button-size-extralarge', label: __( 'Extra Large' ) },
		];

		// Button shape
		const buttonShapeOptions = [
			{ value: 'button-shape-square', label: __( 'Square' ) },
			{ value: 'button-shape-rounded', label: __( 'Rounded Square' ) },
			{ value: 'button-shape-circular', label: __( 'Circular' ) },
		];

		return [
			// Show the alignment toolbar on focus
			isSelected && (
				<BlockControls key="controls">
					<AlignmentToolbar
						value={ buttonAlignment }
						onChange={ ( value ) => {
							setAttributes( { buttonAlignment: value } );
						} }
					/>
				</BlockControls>
			),
			// Show the block controls on focus
			isSelected && (
				<Inspector
					{ ...{ buttonSizeOptions, buttonShapeOptions, setAttributes, ...this.props} }
				/>
			),
			// Show the button markup in the editor
			<CustomButton { ...this.props }>
				<RichText
					tagName="span"
					placeholder={ __( 'Button text...' ) }
					isSelected={ isSelected }
					keepPlaceholderOnFocus
					value={ buttonText }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					className={ classnames(
						'atomic-button',
						buttonShape,
						buttonSize,
					) }
					style={ {
						color: buttonTextColor,
						backgroundColor: buttonBackgroundColor,
					} }
					onChange={ (value) => setAttributes( { buttonText: value } ) }
				/>
			</CustomButton>,
			!! this.props.focus && (
				<form
					key="form-link"
					className={ `blocks-button__inline-link ab-button-${buttonAlignment}`}
					onSubmit={ event => event.preventDefault() }
					style={ {
						textAlign: buttonAlignment,
					} }
				>
					<Dashicon icon={ 'admin-links' } />
					<UrlInput
						className="button-url"
						value={ buttonUrl }
						onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
					/>
					<IconButton
						icon="editor-break"
						label={ __( 'Apply' ) }
						type="submit"
					/>
				</form>
			)
		];
	}
}

// Register the block
registerBlockType( 'atomic/atomic-button', {
	title: __( 'AB Button' ),
	description: __( 'Add a customizable button.' ),
	icon: 'admin-links',
	category: 'common',
	keywords: [
		__( 'button' ),
		__( 'link' ),
		__( 'atomic' ),
	],
	attributes: {
		buttonText: {
			type: 'array',
			source: 'children',
			selector: 'a',
		},
		buttonUrl: {
			type: 'string',
            source: 'attribute',
            selector: 'a',
            attribute: 'href',
		},
		buttonAlignment: {
			type: 'string',
			default: 'left',
		},
		buttonBackgroundColor: {
			type: 'string',
			default: '#3373dc'
		},
		buttonTextColor: {
			type: 'string',
			default: '#ffffff'
		},
		buttonSize: {
			type: 'string',
			default: 'button-size-medium'
		},
		buttonShape: {
			type: 'string',
			default: 'button-shape-rounded'
		},
		buttonTarget: {
			type: 'boolean',
			default: false
		},
	},

	// Render the block components
	edit: ABButtonBlock,

	// Save the attributes and markup
	save: function( props ) {

		const { buttonText, buttonUrl, buttonAlignment, buttonBackgroundColor, buttonTextColor, buttonSize, buttonShape, buttonTarget } = props.attributes;

		return (
			<CustomButton { ...props }>			
				{	// Check if there is button text and output
					buttonText && (
					<a
						href={ buttonUrl }
						target={ buttonTarget ? '_blank' : '_self' } 
						className={ classnames(
							'atomic-button',
							buttonShape,
							buttonSize,
						) }
						style={ {
							color: buttonTextColor,
							backgroundColor: buttonBackgroundColor,
						} }
					>
						{ buttonText }
					</a>
				) }	
			</CustomButton>
		);
	},
} );