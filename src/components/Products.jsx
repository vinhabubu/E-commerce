import React from 'react';
import styled from "styled-components";
import Product from './Product';
import {popularProducts} from '../data'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { Search} from "@material-ui/icons";


const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    `;

  //   const SearchContainer = styled.div`
  
  //   display: flex;
  //   align-items: center;
  //   margin-left: 25px;
  //   padding: 5px;
  // `;
  
  const Input = styled.input`
  border: none;
  `;
  

const Products = ({cat, filters, sort}) => {
    // console.log(cat, filters, sort)
    const [products,setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    
    useEffect(() => {
        const getProducts = async () => {
            try {
              const res = await axios.get(
                cat
                  ? `http://localhost:5000/api/products?category=${cat}`
                  : "http://localhost:5000/api/products"
              );
              setProducts(res.data);
              console.log(res)
            } catch (err) {}
          };
          getProducts();
    },[cat])

    

    useEffect(() => {
        cat &&
          setFilteredProducts(
            products.filter((item) =>
              Object.entries(filters).every(([key, value]) =>
                item[key].includes(value)
              )
            )
          );
      }, [products, cat, filters]);

      useEffect(() => {
        if (sort === "newest") {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => a.createdAt - b.createdAt)
          );
        } else if (sort === "asc") {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => a.price - b.price)
          );
        } else {
          setFilteredProducts((prev) =>
            [...prev].sort((a, b) => b.price - a.price)
          );
        }
      },[sort]);


      const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        if (searchInput !== '') {
            const filteredData =products.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })
            setFilteredProducts(filteredData)
        }
        else{
          setFilteredProducts(products)
        }
    }
  return (
      <Container>
        {/* <SearchContainer>
            <Input placeholder="Search"  onChange={(e) => searchItems(e.target.value)}/>
            <Search style={{ color: "gray", fontSize: 16 }} />
        </SearchContainer> */}
        <Container>
        {searchItems.length > 1 ? (
          filteredProducts.map((item) => (
              <Product item={item} key={item.id} />
          ))
        ): (
          products.map((item) => (
            <Product item={item} key={item.id} />
        ))
        )}
        </Container>
      </Container>
  );
};

export default Products;
