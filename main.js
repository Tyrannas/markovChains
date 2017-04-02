const MarkovManager = require('./markovManager.js');
const Markov = require('./markov.js');

const fs = require('fs');
var text = fs.readFileSync('./res/bible.txt').toString();

function main(){
	var mng = new MarkovManager();

	mng.markovs.push(new Markov());
	//mng.markovs.push(new Markov(JSON.parse('bibleMarkov.json')));
	mng.markovs[0].train(text,3);
	console.log(mng.markovs[0]);
	fs.writeFileSync('./res/bibleMarkov.json', JSON.stringify(mng.markovs[0]));
	console.log(mng.generate('et le seigneur', 1));
}

main();