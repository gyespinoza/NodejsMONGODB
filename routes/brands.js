const express = require('express');
var router = express.Router();
const Brand = require('../models/brand');

// rutas
router.get('/', (req, res) => {
    res.render('pages/brand/brandAddEdit', {
        viewTitle: "New Brand"
    });
});

router.post('/', (req, res) => {
    if(req.body._id == '')
    insertBrand(req, res)
    else
    updateBrand(req, res)
});

//metodos para insertar y actualizar
function insertBrand(req, res){
    var brand = new Brand();
    brand.name = req.body.name;
    brand.description = req.body.description;
    brand.save(e => {
        if(!e)
        res.redirect('brand/brandList');
        else
        console.log("Error", e);
    });
}
function updateBrand(req, res){
    Brand.findOneAndUpdate({_id: req.body._id}, req.body, {new:true}, (err, doc) => {
        if(!err){
            res.render('brand/brandList', {
                viewTitle: "Update Brand",
                brand: req.body
            })
        } else {
            console.log("Error", err);
        }
    });
}

router.get('/brandList', (req, res) => {
    Brand.find((error, docs) => {
        if(!error){
            res.render("pages/brand/brandList", {
                viewTitle: "Brands",
                list: docs
            })
        } else {
            console.log("Error", error);
        }
    });
})

router.get('/:id', (req, res) => {
    Brand.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render('pages/brand/brandAddEdit', {
                viewTitle: "Update Brand",
                brand: doc
            });
        }
    });
});


router.get('/delete/:id', (req, res) => {
    Brand.findByIdAndRemove(req.params.id, (err) => {
        if(!err){
            res.redirect('/brand/brandList');
        } else {
            console.log("Error", err);
        }
    });
})

module.exports = router;
