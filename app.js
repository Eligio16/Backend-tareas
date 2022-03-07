const express = require('express');
const app = express();
const date = require(__dirname + '/date.js');

let items = ['Despertarse', 'Lavar Dientes', 'Desayunar'];
let workItems = [];

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', (req, res) =>{

    let day = date.getDay();

    res.render('list', {listTitle: day, newListItem: items});
});

app.post('/', (req, res) => {

    let item = req.body.newItem;

    if (req.body.list === 'Lista'){
        workItems.push(item);
        res.redirect('/work');
    } else{
        items.push(item);
        res.redirect('/');
    }
});

app.get('/work', (req, res)=> {
    res.render('list', {listTitle: 'Lista de Trabajos', newListItem: workItems})
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(3000, ()=>{
    console.log('Corriendo en el puerto 3000');
});