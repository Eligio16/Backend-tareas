const express = require("express");
const mongoose = require('mongoose');

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

// Item.insertMany(defaultItems, (err) => {
//   if (err){
//     console.log(err);
//   } else{
//     console.log('Guardado con éxito');
//   }
// });


app.get("/", function(req, res) {

  res.render("list", {listTitle: 'Today', newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
