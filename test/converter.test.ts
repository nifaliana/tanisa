import { describe, it, expect, beforeEach } from "vitest";
import { MalagasyNumberToWords, MalagasyNumerals } from "../src";

describe("MalagasyNumberToWords", () => {
  let converter: MalagasyNumberToWords;

  beforeEach(() => {
    converter = new MalagasyNumberToWords();
  });

  const testCases: [number | string, string][] = [
    [0, "aotra"],
    [1, "iray"],
    [5, "dimy"],
    [9, "sivy"],
    // // Tens
    [10, "folo"],
    [11, "iraika amby folo"],
    [15, "dimy amby folo"],
    [20, "roapolo"],
    [21, "iraika amby roapolo"],
    [35, "dimy amby telopolo"],
    [99, "sivy amby sivifolo"],
    // // Hundreds
    [100, "zato"],
    [101, "iraika amby zato"],
    [110, "folo amby zato"],
    [111, "iraika amby folo amby zato"],
    [121, "iraika amby roapolo amby zato"],
    [200, "roanjato"],
    [201, "iraika amby roanjato"],
    [210, "folo sy roanjato"],
    [225, "dimy amby roapolo sy roanjato"],
    [600, "enin-jato"],
    [999, "sivy amby sivifolo sy sivinjato"],
    // // Thousands
    [1000, "arivo"],
    [1001, "iray sy arivo"],
    [1010, "folo sy arivo"],
    [1011, "iraika amby folo sy arivo"],
    [1378, "valo amby fitopolo sy telonjato sy arivo"],
    [2000, "roa arivo"],
    [2023, "telo amby roapolo sy roa arivo"],
    // Ten Thousands (Alina)
    [10000, "iray alina"],
    [15000, "dimy arivo sy iray alina"],
    [20000, "roa alina"],
    [98_765, "dimy amby enimpolo sy fitonjato sy valo arivo sy sivy alina"],
    // Hundred Thousands (Hetsy)
    [100000, "iray hetsy"],
    [
      123456,
      "enina amby dimampolo sy efajato sy telo arivo sy roa alina sy iray hetsy",
    ],
    [500000, "dimy hetsy"],
    [
      654321,
      "iraika amby roapolo sy telonjato sy efatra arivo sy dimy alina sy enina hetsy",
    ],
    // Millions (Tapitrisa)
    [1000000, "iray tapitrisa"],
    [1000001, "iray sy iray tapitrisa"],
    [2500000, "dimy hetsy sy roa tapitrisa"],
    [
      9876543,
      "telo amby efapolo sy dimanjato sy enina arivo sy fito alina sy valo hetsy sy sivy tapitrisa",
    ],
    // Larger Units
    [10000000, "iray safatsiroa"],
    [100000000, "iray tsitamboisa"],
    [1000000000, "iray lavitrisa"],
    [
      12345678901,
      "iraika amby sivinjato sy valo arivo sy fito alina sy enina hetsy sy dimy tapitrisa sy efatra safatsiroa sy telo tsitamboisa sy roa lavitrisa sy iray alinkisa",
    ],
    [1_100_000_000_000, "iray tsipesimpesina sy iray tsitokotsiforohana"],
    // Decimals
    [0.5, "aotra faingo dimy"],
    [0.1, "aotra faingo iray"],
    ["2.00100", "roa faingo aotra aotra zato"],
    [
      1378.23,
      "valo amby fitopolo sy telonjato sy arivo faingo telo amby roapolo",
    ],
    [100.01, "zato faingo aotra iray"],
    [0.005, "aotra faingo aotra aotra dimy"],
  ];

  it.each(testCases)('should convert %s to "%s"', (input, expected) => {
    expect(converter.toWords(input)).toBe(expected);
  });

  describe("Error Handling", () => {
    it("should throw TypeError for invalid input", () => {
      expect(() => converter.toWords("not a number")).toThrow(TypeError);
      expect(() => converter.toWords("123.abc")).toThrow(TypeError);
      expect(() => converter.toWords(NaN)).toThrow(TypeError);
    });

    it("should throw RangeError for negative numbers", () => {
      expect(() => converter.toWords(-1)).toThrow(RangeError);
      expect(() => converter.toWords(-100.5)).toThrow(RangeError);
      expect(() => converter.toWords("-0")).not.toThrow(RangeError);
      expect(converter.toWords("-0")).toBe("aotra");
    });

    it("should throw RangeError for numbers exceeding the limit", () => {
      const limit = MalagasyNumerals.MAX_SUPPORTED_INTEGER;
      const largeNumber = BigInt(limit) + BigInt(1);

      expect(() => converter.toWords(limit)).toThrow(RangeError);
      expect(() => converter.toWords(largeNumber.toString())).toThrow(
        RangeError
      );
    });

    it("should handle string input correctly", () => {
      expect(converter.toWords("123")).toBe("telo amby roapolo amby zato");
      expect(converter.toWords("1000.5")).toBe("arivo faingo dimy");
    });

    it("should handle number input with maximum safe integer", () => {
      const safeInt = Number.MAX_SAFE_INTEGER; // 9_007_199_254_740_991
      expect(() => converter.toWords(safeInt)).not.toThrow();
    });
  });
});
