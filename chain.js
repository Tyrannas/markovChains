class Chain{
	constructor( _chain = {nbPred : 0, preds : [], indexes : {}}) {
		//total number of word occurences associated to the chain
		this.nbPred = _chain.nbPred;
		//words associated to the chain
		this.preds = _chain.preds;
		//indexes of the words
		this.indexes = _chain.indexes;
	}

	addEntry(pred){
		this.nbPred++;
		var id = this.indexes[pred];
		//does the word already exists in the words associated with this chain? 
		if(id !== undefined){
			//if yes then just increment the occurence
			this.preds[id].occur++;
		}
		else{
			//else create it and update the index
			var i = this.preds.push({word:pred, occur:1, proba: 1/this.nbPred});
			this.indexes[pred] = i - 1;
		}
		//then update the probabilities
		this.preds.map(e => e.proba = e.occur/this.nbPred);
	}

	//returns a word considering it's probability of appearance
	getWord(){
		//generate a randome number between 0 and 1
		var r = Math.random();
		var sum = 0;
		//for each of the words associated with the chain
		for(var e of this.preds){
			//add the word probability to the sum
			sum += e.proba;
			//once the sum reaches r or above
			if(sum > r){
				//pick the word
				return e.word;
			}
		}
	}
};

module.exports = Chain;