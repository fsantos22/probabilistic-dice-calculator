import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function App() {
  const [range, setRange] = useState("");
  const [dices, setDices] = useState([
    {
      index: "",
      dice: "",
      bonus: "",
    },
  ]);
  const [opType, setOpType] = useState("");
  const [answer, setAnswer] = useState("Resultado:");

  const handleAddDice = () => {
    const dicesObj = dices.filter((dice) => dice.dice === "");

    if (dicesObj.length > 0) {
      alert("Você não definiu o valor de algum dos dados");
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
    console.log("del-index", index);
    const newArr = [...dices];
    newArr.map((dice) => {
      return dice !== dice[index];
    });
    console.log("newArr", newArr);
    newArr.splice(index, 1);
    setDices(newArr);
  };

  const createDiceInput = (index = dices.length) => {
    return (
      <Box id={dices.length - 1}>
        <TextField
          label="Tipo de dado"
          onChange={() => handleChange(index)}
          variant="outlined"
        />
        <span> + </span>
        <TextField
          label="Bônus fixo"
          onChange={(e) => {
            handleChangeBonus(index, e);
          }}
          sx={{ m: 1 }}
          variant="outlined"
        />
        {dices.length > 1 && (
          <Button variant="contained" onClick={() => handleDeleteItem(index)}>
            Remover dado
          </Button>
        )}
      </Box>
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
    if (opType === '') {
      alert("Defina uma condição antes de calcular");
      return;
    }
    if (range < 1) {
      alert("O intervalo de avaliação não foi selecionado");
      return;
    }
    if (dices.lenght < 2 || dices[0].dice === "") {
      alert("Nenhum dado foi preenchido ainda");
    }
    const dicesObj = dices.filter((dice) => dice.dice !== "");

    const sumOfCombinations = dicesObj.reduce(
      (total, current) => total * current.dice,
      1
    );

    const spreadedDicesArray = dicesObj.map((d) => {
      const start = 1 + (d.bonus ? parseInt(d.bonus) : 0);
      const end = parseInt(d.dice) + (d.bonus ? parseInt(d.bonus) : 0);
      return createSpreadedDiceArray(start, end);
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
    const text = e.target.value;
    const numericValue = parseInt(text.replace(/[^0-9]/g, "")) || '';
    arr[index].dice = numericValue > 100 ? 100 : numericValue;
    arr[index].index = index;
    setDices(arr);
  };

  const handleChangeBonus = (index, e) => {
    let arr = [...dices];
    const text = e.target.value;
    const numericValue = parseInt(text.replace(/[^0-9]/g, "")) || '';
    arr[index].bonus = numericValue > 100 ? 100 : numericValue;
    arr[index].index = index;
    setDices(arr);
  };

  const handleChangeRange = (e) => {
    const text = e.target.value;
    const numericValue = parseInt(text.replace(/[^0-9]/g, "")) || '';
    setRange(numericValue);
  };

  const renderDiceInputs = () => {
    if (dices.length > 0) {
      const allDices = dices.map((dice, index) => {
        return (
          <Box key={index} display="flex" alignItems="center">
            <TextField
              label="Tipo de dado"
              id={`${index}-d${dice.dice}`}
              onChange={(e) => {
                handleChange(index, e);
              }}
              value={dice.dice}
              sx={{ m: 1 }}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">D</InputAdornment>
                ),
              }}
            />
            <span> + </span>
            <TextField
              label="Bônus fixo"
              id={`${index}-d${dice.dice}`}
              onChange={(e) => {
                handleChangeBonus(index, e);
              }}
              value={dice.bonus}
              sx={{ m: 1 }}
              variant="outlined"
            />
            {dices.length > 1 && (
              <Button
                variant="contained"
                onClick={() => handleDeleteItem(index)}
              >
                Remover dado
              </Button>
            )}
          </Box>
        );
      });
      return allDices;
    }
    return newInput;
  };

  const listedDices = renderDiceInputs();

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h3" align="center">
          Calculadora Probabilística de Dados
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            value={opType}
            onChange={(e) => setOpType(e.target.value)}
            select
            label="Condições"
            helperText="Defina uma condição"
          >
            <MenuItem value={"lte"}>Menor ou igual a:</MenuItem>
            <MenuItem value={"gte"}>Maior ou igual a:</MenuItem>
            <MenuItem value={"lt"}>Menor que:</MenuItem>
            <MenuItem value={"gt"}>Maior que:</MenuItem>
          </TextField>
          <TextField
            value={range}
            onChange={(e) => handleChangeRange(e)}
            label="Intervalo"
            helperText="Defina um intervalo"
          />
        </Box>

        <Button variant="contained" onClick={handleAddDice}>
          Adicionar dado
        </Button>
        <Box className="dices-container">{listedDices}</Box>
        <Button variant="contained" onClick={handleCalculate}>
          Calcular
        </Button>
        <Typography variant="h5" align="center">
          {answer}
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
