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
    await mongoose.connect('Conexion con mongo Atlas');
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
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === 'Today'){
    item.save();
    res.redirect('/');
  } else{
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/'+listName);
    });
  }
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === 'Today'){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log('Eliminado');
        res.redirect('/');
      }
    });
  } else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err){
        res.redirect('' + listName);
      }
    });
  }
});

app.get('/:idListName', (req, res) => {
  const idListName = _.capitalize(req.params.idListName);

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, function() {
  console.log("Server started successfully");
});
