const express= require('express');
const app=express();
const date = require(__dirname+"/date.js");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static("assets"));

var workList=[];
mongoose.connect("mongodb://localhost:27017/todoListDB", {useNewUrlParser:true})

const itemsSchema = new mongoose.Schema({
    name: String,
});
const Item = mongoose.model("Item",itemsSchema);

const listSchema =new mongoose.Schema({
    name: String,
    items : [itemsSchema],
})
const List = mongoose.model("List",listSchema);


const item1 = new Item({
    name: "Welcome to your ToDo List!!",
})
const item2 = new Item({
    name: "Hit the + button to add a new item.",
})
const item3 = new Item({
    name: "<--Hit to delete an item.",
})




app.get('/' ,function(req,res){
    
    Item.find({},function(err,result){

        if(result.length == 0){
            Item.insertMany([item1,item2,item3], function(e){
                if(e){
                    console.log(e);
                }else{
                    console.log("Insertion successfull");
                }
            })
            res.redirect('/')
        }else{

            res.render('list',{
                listHead : date.getDate(),
                itemList : result, 
            })
        }
    })
});
app.get('/work',function(req,res){
    res.render('list.ejs',{
        listHead : "WorkSpace",
        itemList : workList 
    })
})
app.post('/',function (req,res) {
    const itemName = req.body.newItem;
    const listName = req.body.typeOfItem;

    const newItem = new Item({
        name:itemName,
    })
    if(listName.indexOf(',')!=-1){
        newItem.save();
        res.redirect('/');
    }else{
        List.findOne({name : listName},function(e,result){
            result.items.push(newItem);
            result.save();
            res.redirect("/"+listName);
        })
    }

})
app.get('/:customListName_', function(req,res){
    const customListName = req.params.customListName_;
    // console.log(customListName);
    List.findOne({
        name: customListName,
    },function(err,result){
        if(!err){
            if(!result){
                //create a new list
                const list = new List({
                    name : customListName,
                    items : [item1,item2,item3],
                })
                list.save();
                res.redirect('/'+customListName)
            }else{
                //show an existing list
                res.render('list.ejs',{
                    listHead : customListName,
                    itemList : result.items, 
                })
            }
        }
    })
    

})


app.post('/delete' , function(req,res){
   const itemID= req.body.checkedItem;
   const listName = req.body.listTitle;
//    console.log(req.body);
    if(req.body.listTitle.indexOf(',')!=-1){
        Item.findByIdAndDelete(itemID,function(err){
         if(err){
             console.log(err)
         }else{
             res.redirect('/');
         }
        });
    }else{
        List.findOneAndUpdate({
            name : listName,
        },{
            $pull : { items: { _id: itemID}}
        },function(e,result){
            if(!e){
                res.redirect("/"+listName);
            }
        })
    }

})

app.listen(3000,function(){
    console.log("Server is Up!")
})