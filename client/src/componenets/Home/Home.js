import React, { useState, useEffect } from 'react'
import useStyles from './styles';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

const categories = [
    { id: 1, type: 'All' },
    { id: 2, type: 'Clothes' },
    { id: 3, type: 'Shoes' },
    { id: 4, type: 'Computers' },
    { id: 5, type: 'Computer Accessories' },
    { id: 6, type: 'Phones' },
    { id: 7, type: 'Skin Cares' },
    { id: 8, type: 'Books' },
    { id: 9, type: 'Furnitures' },
    { id: 10, type: 'Accessories' },

]

const Home = () => {
    const classes = useStyles();
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {

    }, [selectedCategory])

    return (
        <main className={classes.content}>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                className={classes.categories}
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                MenuProps={{ classes: { paper: classes.menuPaper } }}
                            >
                                {categories.map(category => (
                                    <MenuItem key={category.id} value={category.type}>{category.type}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                {selectedCategories.map(category => (
                                    <MenuItem key={category.type} value={category.type}>{category.type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}
                </Grid>
            </div>
            {/* <Grid container justify="center" spacing={4}>
                {products.map((product) => (
                    <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
                        <Product product={product} onAddToCart={onAddToCart} />
                    </Grid>
                ))}
            </Grid> */}
        </main>
    )
}

export default Home
