const express = require("express");
const mongoose = require('mongoose');
let _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://localhost:27017/itemsDB');
}

const itemSchema = new mongoose.Schema({
  name : {
    type: String,
    required: [true]
  }
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name: 'Cocinar'
});

const item2 = new Item({
  name: 'Comer'
});

const defaultItems = [item1, item2];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model('List', listSchema);

app.get("/", function(req, res) {

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err){
          console.log(err);
        } else{
          console.log('Guardado con éxito');
        }
      });
      res.redirect('/');
    } else{
      res.render("list", {listTitle: 'Today', newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log('Eliminado');
      res.redirect('/');
    }
    else{
      console.log(err);
      res.redirect('/');
    }
  });
});

app.get('/:idListName', (req, res) => {
  const idListName = req.params.idListName;

  List.findOne({name: idListName}, (err, foundList) => {
    if (!err){
      if(!foundList){
        //No Existe
        const list = new List({
          name: idListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect('/'+idListName);
      } else{
        //Existe
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
      }
    }  

  });
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
