package main

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var appPath = "./app"
var outFileName = "../app.go"
var outFilePackage = "package main\n\n"

var buffer bytes.Buffer

func main() {

	buffer.WriteString(outFilePackage)

	buffer.WriteString("var files = map[string]string{")

	err := filepath.Walk(appPath,
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			filerc, err := os.Open(path)
			if err != nil {
				return err
			}
			defer filerc.Close()

			buf := new(bytes.Buffer)
			buf.ReadFrom(filerc)

			pathRune := []rune(path)
			path = string(pathRune[(len(appPath) - 1):len(path)])
			path = strings.Replace(path, "\\", "/", -1)
			encodedUrl := hex.EncodeToString([]byte("/" + path))
			encodedContent := hex.EncodeToString(buf.Bytes())

			//decoded, err := hex.DecodeString(encodedContent)

			fmt.Println("/" + path)
			//fmt.Print(Url)

			buffer.WriteString(`"` + encodedUrl + `": "` + encodedContent + `",`)
			return nil
		})
	if err != nil {
		log.Println(err)
	}

	buffer.WriteString("}")

	//fmt.Println(m["one"])
	//fmt.Println(buffer.String())

	file, err := os.Create(outFileName)
	if err != nil {
		log.Fatal("Cannot create file", err)
	}
	defer file.Close()

	fmt.Fprintf(file, buffer.String())
}
