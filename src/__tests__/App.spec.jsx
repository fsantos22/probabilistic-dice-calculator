import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import App from "../App";

const mapElements = (container) => {
  const elements = {
    titleInputText: container.getByText(/Calculadora Probabilística de Dados/),
    conditionsOptSelect: container.getByRole('combobox'),
    rangetSelectInput: container.getByLabelText(/Intervalo/),

    addDiceButton: container.getByRole("button", { name: "Adicionar dado" }),
    typeOfDiceInput: container.getByLabelText(/Tipo de dado/),
    bonusInput: container.getByLabelText(/Bônus fixo/),
    calculateButton: container.getByRole("button", { name: "Calcular" }),
    responseText: container.getByTestId('response-container'),
  };
  return elements;
};

it("should show screen elements", () => {
  const container = render(<App />);
  const elements = mapElements(container);

  Object.keys(elements).forEach((element) => {
    expect(elements[element]).toBeInTheDocument();
  });
});

it.skip("should show toast when mandatory fields are empty", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  const text = /Defina uma condição antes de calcular/;

  const toastContainerNotVisible = container.queryByText(text);

  expect(toastContainerNotVisible).not.toBeInTheDocument();

  await userEvent.click(elements.calculateButton);
  const toastContainerVisible = container.getByText(text);

  expect(toastContainerVisible).toBeInTheDocument();
});

it("should show toast when range is not set", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  await userEvent.type(elements.typeOfDiceInput, "6");
  const text = /O intervalo de avaliação não foi selecionado/;
  const toastContainerNotVisible = container.queryByText(text);
  expect(toastContainerNotVisible).not.toBeInTheDocument();
  await userEvent.click(elements.calculateButton);
  const toastContainerVisible = container.getByText(text);
  expect(toastContainerVisible).toBeInTheDocument();
});

it("should show toast when dice type is not set", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  await userEvent.type(elements.rangetSelectInput, "6");
  const text = /Nenhum dado foi preenchido ainda/;
  const toastContainerNotVisible = container.queryByText(text);
  expect(toastContainerNotVisible).not.toBeInTheDocument();
  await userEvent.click(elements.calculateButton);
  const toastContainerVisible = container.getByText(text);
  expect(toastContainerVisible).toBeInTheDocument();
});

it("should accept only numbers on Dice Input", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  await userEvent.type(elements.typeOfDiceInput, "a.2y0r$");
  expect(elements.typeOfDiceInput.value).toEqual("20");
});

it("should accept max value 100 on dice input", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  await userEvent.type(elements.typeOfDiceInput, "150");
  expect(elements.typeOfDiceInput.value).toEqual("100");
});

it("should accept max value 100 on bonus input", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  await userEvent.type(elements.bonusInput, "150");
  expect(elements.bonusInput.value).toEqual("100");
});

// const testCases = [];

it.skip("should not add a new dice input when you have a previous blank", async () => {
  const container = render(<App />);
  const elements = mapElements(container);
  // fireEvent.change(elements.rangetSelectInput, { target: { value: "11" } });
  // fireEvent.change(elements.typeOfDiceInput, { target: { value: "20" } });
  // fireEvent.change(elements.bonusInput, { target: { value: "0" } });
  // await userEvent.type(elements.conditionsOptSelect, "gte");
  await userEvent.type(elements.rangetSelectInput, "11");
  await userEvent.type(elements.typeOfDiceInput, "20");
  await userEvent.type(elements.bonusInput, "0");

  console.log("dados ---", {
    conditions: elements.conditionsOptSelect.value,
    range: elements.rangetSelectInput.value,
    dice: elements.typeOfDiceInput.value,
    bonus: elements.bonusInput.value,
  });

  await userEvent.click(elements.calculateButton);

  await waitFor(() => {
    const ans = container.getByTestId("response-container");
    expect(ans).toBeInTheDocument();
    expect(elements.responseText).toHaveTextContent(/A probabilidade é de 50%/);
  });
});
