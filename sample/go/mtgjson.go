package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strings"
)

type Rarity []string

func (r Rarity) String() string {
	if len(r) == 1 {
		return `"` + r[0] + `"`
	}
	if len(r) == 0 {
		return "[]"
	}
	return `["` + strings.Join([]string(r), `","`) + `"]`
}

func (r *Rarity) MarshalJSON() ([]byte, error) {
	return []byte(r.String()), nil
}

func (r *Rarity) UnmarshalJSON(p []byte) error {
	max := len(p)
	if max > 32 {
		max = 32
	}
	switch p[0] {
	case '[':
		d := p[1:]
		end := bytes.IndexByte(d, ']')
		if end < 3 || d[0] != '"' || d[end-1] != '"' {
			break
		}
		// TODO: missing whitespace cleanup. Ok in intended dataset
		*r = strings.Split(string(d[1:end-1]), `","`)
		return nil
	case '"':
		d := p[1:]
		end := bytes.IndexByte(d, '"')
		if end < 0 {
			break
		}
		*r = []string{string(d[:end])}
		return nil
	}
	return fmt.Errorf("invalid rarity entry: %q...", p[:max])
}

type Set struct {
	Name               string    `json:"name"`
	Code               string    `json:"code"`
	GathererCode       string    `json:"gathererCode,omitempty"`
	OldCode            string    `json:"oldCode,omitempty"`
	MagicCardsInfoCode string    `json:"magicCardsInfoCode,omitempty"`
	ReleaseDate        string    `json:"releaseDate"`
	Border             string    `json:"border"`
	SetType            string    `json:"type"`
	Block              string    `json:"block"`
	OnlineOnly         bool      `json:"onlineOnly,omitempty"`
	Booster            []*Rarity `json:"booster"`
	Cards              []Card    `json:"cards"`
}

type Legality struct {
	Format   string `json:"format"`
	Legality string `json:"legality"`
	//Condition string `json:"condition,omitempty"`
}

type Ruling struct {
	Date string `json:"date"`
	Text string `json:"text"`
}

type ForeignName struct {
	Lang         string `json:"language"`
	Name         string `json:"name"`
	MultiverseID int    `json:"multiverseid"` // MULTIVID
}

type Card struct {
	Id     string `json:"id"`
	Layout string `json:"layout"`

	Power     string `json:"power,omitempty"`
	Toughness string `json:"toughness,omitempty"`
	Loyalty   int    `json:"loyalty,omitempty"`
	Hand      int    `json:"hand,omitempty"`
	Life      int    `json:"life,omitempty"`

	ConvManaCost float32 `json:"cmc,omitempty"`
	ManaCost     string  `json:"manaCost"`

	Text         string `json:"text"`
	OriginalText string `json:"originalText,omitempty"`

	Name         string        `json:"name"`
	Names        []string      `json:"names,omitempty"`
	ForeignNames []ForeignName `json:"foreignNames,omitempty"`
	FullType     string        `json:"type"`
	OriginalType string        `json:"originalType,omitempty"`
	Supertypes   []string      `json:"supertypes"`
	Types        []string      `json:"types"`
	Subtypes     []string      `json:"subtypes"`
	Colors       []string      `json:"colors"`
	Rarity       string        `json:"rarity"`

	Timeshifted bool `json:"timeshifted,omitempty"`
	Reserved    bool `json:"reserved,omitempty"`
	Starter     bool `json:"starter"`

	Flavor string `json:"flavor"`

	MultiverseID int        `json:"multiverseid"` // MULTIVID
	Number       string     `json:"number"`
	Variations   []int      `json:"variations,omitempty"` // MULTIVID
	Source       string     `json:"source,omitempty"`
	Watermark    string     `json:"watermark,omitempty"`
	Artist       string     `json:"artist"`
	ImageName    string     `json:"imageName"`
	Legalities   []Legality `json:"legalities"`
	Rulings      []Ruling   `json:"rulings,omitempty"`
	Printings    []string   `json:"printings"`
}

// download http://mtgjson.com/json/AllSets-x.json.zip
// unzip it and pass it as the first argument

func main() {
	data, err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	setmap := make(map[string]Set)
	// TODO: faster (but longer) with json.NewDecoder
	err = json.Unmarshal(data, &setmap)
	if err != nil {
		fmt.Printf("%[1]s\n%[1]#v\n", err)
	}
	fmt.Printf("Found %d sets,\n", len(setmap))
}
