const config = {};
const Markov = require("./markov.js");
config.endPhrase = [".","!","?"];
config.punctuation = [".", "!", "?", ";", ":", ","];

class MarkovManager {
	constructor(_markManager = { markovs : []}) {
		this.markovs = [];
		for(m in _markManager.markovs){
			this.markovs.push(new Markov(m));
		}
	};

	addMarkov(_markov){
		this.markovs.push(_markov);
	};

	//generating function, generate n +/- 2 sentences from a set of words.
	generate(words, n){
		//transform the text into a table
		words = words.replace(/\d/g,'').split(/\b/i).map(e => e.trim()).filter(e => e !== "");
		let sentences = "";
		//let's generate n sentences 
		for(let i = 0; i < n; ++i){
			//generate a sentence
			let res = this.generateSentence(words);
			sentences += res.sentence;
			//the new generating words are the n last ones generated
			words = res.words;
		}
		return sentences;
	};

	//generate a sentence i.e a set of words terminated by a terminating punctuation
	generateSentence(words){
		let sentence = "";
		let tempWords = words;
		let maxTrainedLength = 1;
		let word;

		for(let m of this.markovs){
			let l = Object.keys(m.chains)[0].length;
			if(l > maxTrainedLength) 
				maxTrainedLength = l;
		}
		console.log(maxTrainedLength);
		//while the end of the sentence is not reached
		while(config.endPhrase.indexOf(word) === -1){
			//generate a word
			//let each trained markov chose a word
			word = this.markovs[0].generateWord(tempWords);
			//add the word to the sentence
			(config.punctuation.indexOf(word) === -1 ) ? sentence += " " + word : sentence += word;
			//update the generating words
			if(tempWords.length >= maxTrainedLength)
				tempWords.shift();
			tempWords.push(word);
		}
		//return the sentence and the new generating words
		return { sentence : sentence, words : tempWords};
	};


}

module.exports = MarkovManager;