import React, { useEffect, useState } from "react";
import Gelato from "./Gelato";
import axios from "axios";
import data from "../fakeData";

const url = "https://react--course-api.herokuapp.com/api/v1/data/gelateria";

const Menu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [prodotti, setProdotti] = useState(data);
  const [selected, setSelected] = useState(0);
  const [filterProduct, setFilterProduct] = useState(prodotti);
  const [categorie, setCategorie] = useState([])

  const filtraProdotti = (categoria, index) => {
    setSelected(index)
    if(categoria === 'all'){
      setFilterProduct(prodotti)
    }
    else {
      const prodottiFiltrati = prodotti.filter((el) =>
        el.categoria === categoria ? el : ""
      );
      setFilterProduct(prodottiFiltrati);
    }
  }

  useEffect(() => {
    (async() => {
      setIsLoading(true)
      setIsError(false)
      try {
        const response = await axios.get(url)
        console.log(response)
        setProdotti(response.data.data)
        setFilterProduct(response.data.data)

        const nuoveCategorie = Array.from(
          new Set(response.data.data.map((el) => el.categoria))
        );
        nuoveCategorie.unshift('all');
        setCategorie(nuoveCategorie);

        setIsLoading(false)
      } catch(error){
        console.log(error);
        setIsLoading(false)
        setIsError(true)
      }
    })()
  }, [])
  return <div className="container">
    <h4 style={{textAlign:'center', textTransform: 'uppercase'}}>Le nostre Scelte</h4>
    {!isLoading && !isError ? (
        <>
           <div className="lista-categorie">
    {categorie.map((categoria, index) => {
      return <button key={index} onClick={() => filtraProdotti(categoria, index)} className={`btn btn-selector ${index === selected && "active"}`}>
          {categoria}
        </button>
    })}
    </div>
    <div className="vetrina">
      {
        filterProduct.map((el) => (<Gelato key={el.id} {...el}/>))
      }
    </div>
        </>
      ) : !isLoading && isError ? (
         <h4 style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>Error...</h4>
  ) : (
    <h4 style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>Loading...</h4>
  )}
   </div>
  
};

export default Menu;
