var Markov = {
	chains : {},
};

const config = {};
config.endPhrase = [".","!","?"];
config.punctuation = [".", "!", "?", ";", ":", ","];

//training function
Markov.train = function(text, n){
	//split the text in separate words and remove spaces
	text = text.replace(/\d/g,'').split(/\b/i).map(e => e.trim()).filter(e => e !== "");
	//add n white words for the first word
	for(i = 0; i < n; ++i) {
		text.unshift('');
	}
	//train for each word
	//i = n for the n blank elements 
	for(i = n; i < text.length; ++i){
		Markov.addWord(text.slice(i-n,i), text[i]);
	}
};

//generating function, generate n +/- 2 sentences from a set of words.
Markov.generate = function(words, n){
	//number of sentences which will be generated
	n = Math.floor(Math.random() * n + (n + 2));
	//transform the text into a table
	words = words.replace(/\d/g,'').split(/\b/i).map(e => e.trim()).filter(e => e !== "");
	var sentences = "";
	//let's generate n sentences 
	for(i = 0; i < n; ++i){
		//generate a sentence
		res = Markov.generateSentence(words);
		sentences += res.sentence;
		//the new generating words are the n last ones generated
		words = res.words;
	}
	return sentences;
}

//generate a sentence i.e a set of words terminated by a terminating punctuation
Markov.generateSentence = function(words){
	var sentence = "";
	var word = "";
	var wordTemp = words;
	var trainedLength = Object.keys(Markov.chains)[0].length;
	console.log(trainedLength);
	//while the end of the sentence is not reached
	while(config.endPhrase.indexOf(word) === -1){
		//generate a word
		word = Markov.generateWord(wordTemp);
		//add the word to the sentence
		(config.punctuation.indexOf(word) === -1 ) ? sentence += " " + word : sentence += word;
		//update the generating words
		if(wordTemp.length >= trainedLength)
			wordTemp.shift();
		wordTemp.push(word);
	}
	//return the sentence and the new generating words
	return {sentence:sentence, words: wordTemp};
}

//generate a word
Markov.generateWord = function(words){
	let chain = Markov.chains[words.join('-')];
	//if the exact chain existes then generate words from it
	if(chain){
		return chain.getWord();
	}
	//else try all possibilities, from the more acurate to the least
	else{
		for(j = words.length; j > 0; --j){
			for(c in Markov.chains){
				console.log("chaine: " + c + " mots: " + words.slice(0,j).join('-'));
				if(c.indexOf(words.slice(0,j).join('-')) === 0){
					return c.split('-')[j+1];
				}
			}
		}
		//do something 
	}
}

//add a word to predict to the chains
Markov.addWord = function(words, pred){
	//if the chain doesnt already exist
	if(!Markov.chains[words.join('-')]){
		//lets create it
		Markov.chains[words.join('-')] = new Chain();
	}
	//just add the new entry to the chain
	Markov.chains[words.join('-')].addEntry(pred);
}

class Chain{
	constructor() {
		//total number of word occurences associated to the chain
		this.nbPred = 0;
		//words associated to the chain
		this.preds = [];
		//indexes of the words
		this.indexes = {};
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

	// methods
};

module.exports = Markov;


