
//  Copyright © 2019–2020, Stewart Smith. See LICENSE for details.




Q.History = function( instance ){

	this.instance = instance
	this.entries = [[{

		redo:  {},
		undo: [{}]
	}]]
	this.index = 0
	this.isRecording = true
}




Object.assign( Q.History.prototype, {

	assess: function(){

		const instance = this.instance
		if( this.index > 0 ){

			window.dispatchEvent( new CustomEvent(

				'Q.History undo is capable', { detail: { instance }}
			))
		}
		else {

			window.dispatchEvent( new CustomEvent(

				'Q.History undo is depleted', { detail: { instance }}
			))
		}
		if( this.index + 1 < this.entries.length ){

			window.dispatchEvent( new CustomEvent(

				'Q.History redo is capable', { detail: { instance }}
			))
		}
		else {

			window.dispatchEvent( new CustomEvent(

				'Q.History redo is depleted', { detail: { instance }}
			))
		}
		return this
	},
	createEntry$: function(){
		
		this.entries.splice( this.index + 1 )
		this.entries.push([])
		this.index = this.entries.length - 1
	},
	record$: function( entry ){
		

		//  Are we recording this history?
		//  Usually, yes.
		//  But if our history state is “playback”
		//  then we will NOT record this.

		if( this.isRecording ){
		
			this.entries[ this.index ].push( entry )
			this.index = this.entries.length - 1
			this.assess()
		}
		return this
	},
	step$: function( direction ){


		//  If we are stepping backward (undo)
		//  we cannot go back further than index === 0
		//  which we would happen if index is already 0
		//  before we subtract 1.
		//  Similarly, if stepping forward (redo)
		//  we cannot go further than index === entries.length - 1
		//  which would happen if the index is already entries.length
		//  before we add 1.

		if(
			( direction < 0 && this.index < 1 ) || 
			( direction > 0 && this.index > this.entries.length - 2 )
		) return false


		//  Before we step backward (undo) or forward (redo)
		//  we need to turn OFF history recording.

		this.isRecording = false

		const 
		instance = this.instance,
		command = direction < 0 ? 'undo' : 'redo'


		//  If we are stepping forward (redo)
		//  then we need to advance the history index
		//  BEFORE we execute.

		if( direction > 0 ) this.index ++


		//  Take this history entry, which itself is an Array.
		//  It may contain several tasks.
		//  Put my thing down, flip and reverse it.
		//  .ti esrever dna pilf ,nwod gniht ym tuP

		const entry = direction > 0 ?
			Array.from( this.entries[ this.index ]) :
			Array.from( this.entries[ this.index ]).reverse()

		entry
		.reduce( function( tasks, subentry, s ){

			return tasks.concat( subentry[ command ])

		}, [] )
		.forEach( function( task, i ){

			if( typeof task.func === 'function' ){

				task.func.apply( instance, task.args )
			}
		})


		//  If we are stepping backward (undo)
		//  then we decrement the history index
		//  AFTER the execution above.

		if( direction < 0 ) this.index --
		

		//  It’s now safe to turn recording back on.

		this.isRecording = true


		//  Emit an event so the GUI or anyone else listening
		//  can know if we have available undo or redo commands
		//  based on where or index is.
		
		this.assess()
		return true
	},
	undo$: function(){ return this.step$( -1 )},
	redo$: function(){ return this.step$(  1 )},
	report: function(){

		const argsParse = function( output, entry, i ){

			if( i > 0 ) output += ',  '
			return output + ( typeof entry === 'object' && entry.name ? entry.name : entry )
		}
		return this.entries.reduce( function( output, entry, i ){

			output += '\n\n'+ i + ' ════════════════════════════════════════'+
			entry.reduce( function( output, entry, i ){

				output += '\n\n    '+ i +' ────────────────────────────────────────\n'
				if( entry.redo ){
				
					output += '\n        ⟳ Redo   ── '+ entry.redo.name +'  '
					if( entry.redo.args ) output += entry.redo.args.reduce( argsParse, '' )
				}
				output += entry.undo.reduce( function( output, entry, i ){

					output += '\n        ⟲ Undo '+ i +' ── '+ entry.name +'  '
					if( entry.args ) output += entry.args.reduce( argsParse, '' )
					return output

				}, '' )

				return output

			}, '' )
			return output
		
		}, 'History entry cursor: '+ this.index )		
	}
})



