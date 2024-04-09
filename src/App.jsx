import { useState } from "react";
import "./App.css";

function App() {
  const [range, setRange] = useState("");
  const [dices, setDices] = useState([
    {
      index: "",
      dice: "",
      bonus: "",
    },
  ]);
  const [opType, setOpType] = useState("gte");
  const [answer, setAnswer] = useState("Resultado:");

  const handleAddDice = () => {
    if (!dices.length < 2 && dices[0].dice === "") {
      alert("Nenhum dado foi preenchido ainda");
      return;
    }
    setDices([
      ...dices,
      {
        index: "",
        dice: "",
        bonus: 0,
      },
    ]);
  };

  const handleDeleteItem = (index) => {
    const newArr = [...dices];
    dices.map((dice) => {
      return dice.index !== index;
    });
    newArr.splice(index, 1);
    setDices(newArr);
  };

  const createDiceInput = (index = dices.length) => {
    return (
      <label key={dices.length - 1} id={dices.length - 1}>
        Tipo de dado:
        <input type="number" min="2" max="100" onChange={() => handleChange(index)} />
        <span> + </span>
        <label>
          Bonus fixo:
          <input type="number" min="0" max="5" />
        </label>
        {dices.length > 1 && (
          <button onClick={() => handleDeleteItem(index)}>Remover dado</button>
        )}
      </label>
    );
  };

  const newInput = createDiceInput();

  const createSpreadedDiceArray = (start, end) => {
    return Array(end - start + 1)
      .fill()
      .map((_, index) => start + index);
  };

  function* cartesianProduct(head, ...tail) {
    let remainder = tail.length ? cartesianProduct(...tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
  }

  const handleCalculate = () => {
    if (!range) {
      alert("O intervalo de avaliação não foi selecionado");
      return;
    }
    if (dices.lenght < 2 || dices[0].dice === "") {
      alert("Nenhum dado foi preenchido ainda");
    }
    const dicesObj = [...dices];

    const sumOfCombinations = dicesObj.reduce(
      (total, current) => total * current.dice,
      1
    );

    const spreadedDicesArray = dicesObj.map((d) => {
      const start = 1 + (d.bonus ? Number(d.bonus) : 0);
      return createSpreadedDiceArray(start, d.dice);
    });

    const allCombinations = [
      ...cartesianProduct.apply(this, spreadedDicesArray),
    ];

    let successCasesCount = 0;
    let arr = [];
    allCombinations.forEach((array) => {
      const sum = array.reduce((acc, cur) => acc + cur, 0);
      arr.push(sum);
    });
    successCasesCount = arr.filter((sum) => {
      switch (opType) {
        case "gte":
          return sum >= range;
        case "gt":
          return sum > range;
        case "lte":
          return sum <= range;
        case "lt":
          return sum < range;
      }
    }).length;

    const p = ((successCasesCount / sumOfCombinations) * 100).toFixed(1);
    setAnswer(`A probabilidade é de ${p}%`);
  };

  const handleChange = (index, e) => {
    let arr = [...dices];
    arr[index].dice = e.target.value;
    arr[index].index = index;
    setDices(arr);
  };

  const handleChangeBonus = (index, e) => {
    let arr = [...dices];
    arr[index].index = index;
    arr[index].bonus = e.target.value;
    setDices(arr);
  };

  const renderDiceInputs = () => {
    if (dices.length > 0) {
      const allDices = dices.map((dice, index) => {
        return (
          <label key={index} id={`${index}-d${dice.dice}`}>
            Tipo de dado:
            <input
              type="number"
              min="2"
              max="100"
              onChange={(e) => {
                handleChange(index, e);
              }}
            />
            <span> + </span>
            <label>
              Bonus fixo:
              <input
                type="number"
                min="0"
                max="5"
                onChange={(e) => {
                  handleChangeBonus(index, e);
                }}
              />
            </label>
            {dices.length > 1 && (
              <button onClick={() => handleDeleteItem(index)}>
                Remover dado
              </button>
            )}
          </label>
        );
      });
      return allDices;
    }
    return newInput;
  };

  return (
    <>
      <h1>Calculadora Probabilidade de dados</h1>
      <div>
        <h2>Condiçōes</h2>
        <div>
          <select value={opType} onChange={(e) => setOpType(e.target.value)}>
            <option value={"lte"}>Menor ou igual a:</option>
            <option value={"gte"}>Maior ou igual a:</option>
            <option value={"lt"}>Menor que:</option>
            <option value={"gt"}>Maior que:</option>
          </select>
          <input
            className="dice"
            type="number"
            min="1"
            max="100"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleAddDice}>Adicionar dado</button>
      <div className="dices-container">{renderDiceInputs()}</div>
      <button onClick={handleCalculate}>Calcular</button>
      <h3>{answer}</h3>
    </>
  );
}

export default App;
