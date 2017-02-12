const Chain = require("./chain.js");

class Markov {
	constructor( _markov = { chains : []}) {
		this.chains = [];
		if(_markov.chains !== []){
			for(let c in _markov.chains){
				this.chains.push(new Chain(c));
			}
		}
	}

	//add a word to predict to the chains
	addWord(words, pred){
		//if the chain doesnt already exist
		if(!this.chains[words.join('-')]){
			//lets create it
			this.chains[words.join('-')] = new Chain();
		}
		//just add the new entry to the chain
		this.chains[words.join('-')].addEntry(pred);
	};

	//training function
	train(text, n){
		//split the text in separate words and remove spaces
		text = text.replace(/\d/g,'').split(/\b/i).map(e => e.trim()).filter(e => e !== "");
		//add n white words for the first word
		for(let i = 0; i < n; ++i) {
			text.unshift('');
		}
		//train for each word
		//i = n for the n blank elements 
		for(let i = n; i < text.length; ++i){
			this.addWord(text.slice(i-n,i), text[i]);
		}
	};



	//generate a word
	generateWord(words){
		let chain = this.chains[words.join('-')];
		//if the exact chain existes then generate words from it
		if(chain){
			return chain.getWord();
		}
		//else try all possibilities, from the more acurate to the least
		else{
			for(let j = words.length; j > 0; --j){
				for(let c in this.chains){
					console.log("chaine: " + c + " mots: " + words.slice(0,j).join('-'));
					if(c.indexOf(words.slice(0,j).join('-')) === 0){
						return c.split('-')[j+1];
					}
				}
			}
			//do something 
		}
	};
}


module.exports = Markov;


