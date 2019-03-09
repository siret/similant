Quick-Start

## SIMILANT Browser

Application for browsing the data in the browser.

### Prerequisites

- `npm` 6.4.1
- modern browser

### Initialization

1. `git clone https://github.com/siret/similant.git`
2. `cd similant`
3. `npm install`
4. Initialize BROWSER with empty data folder in `/public` folder `cp empty-data data`

### Running

1. `npm start`
2. Browser should open [http://localhost:3000/](http://localhost:3000/) in new tab.

## Configuration files for SIMILANT Browser

All configuration files are stored in `/public/data` folder. Example configuration is in `/public/example` folder.

### Similarity Models

Configuration file `descriptors.json` contains list of similarity models, it is represented as JSON array of JSON objects.

```json
[
	{
		"id": "<model id>",
		"name": "<model name>",
		"url": "<url to model configuration>"
	},
	{
		"id": "<model id>",
		"name": "<model name>",
		"url": "<url to model configuration>"
	},
	...
]
```

#### Model configuration

Configuration file `descriptors/<model>.json` contains information about model and related clustering sizes.

```json
{
	"id": "<model id>",
	"title": "<model name>",
	"type": "<model type>",
	"clusters": [
		{
			"id": "<clustering id>",
			"size": <clustering size>,
			"url": "<clustering url>"
		},
		{
			"id": "<clustering id>",
			"size": <clustering size>,
			"url": "<clustering url>"
		},
		...
	],
	"data": {
		"<record id>": <descriptor related fields>,
		"<record id>": <descriptor related fields>,
		...
	},
	...
	<type related fields>
	...
}
```

The supported types are:

- `time-series` with additional field `axis` (JSON array contains labels of time points).
- `set-tokens` with additional fields
 	- `labels` (JSON objects contains translate table from token to label)
 	- `limit` (number of most frequent shown tokens)

Clustering files are usually placed in `descriptors/<model>/<size>.json` and contains information about groups of records (clusters).

```json
{
	"<cluster id>": {
		"id": "<cluster id>",
		"pos": [ <x position>, <y position> ],
		"radius": <cluster radius>,
		"items": [
			"<record id>",
			"<record id>",
			...
		]
	},
	...
}
```

### Database records

Database records configuration file is placed in `individuals.json` and contains "all" information about every record in database in form of JSON object. Information are shown in left panel.

```json
{
	"<record_id>": {
		"id": "<record_id>",
		"data": {
			"<key>": "<value>",
			"<key>": "<value>",
			...
		}
	},
	"<record_id>": {
		"id": "<record_id>",
		"data": {
			"<key>": "<value>",
			"<key>": "<value>",
			...
		}
	},
	...
}
```

### Targets

Targets configuration file is placed in `targets.json` and is there located list of all available targets. Targets are shown in right panel.

```json
[
	{
		"id": "<target id>",
		"name": "<target name>",
		"url": "<target configuration URL>"
	},
	{
		"id": "<target id>",
		"name": "<target name>",
		"url": "<target configuration URL>"
	},
	...
]
```

Target configuration file contains information about current target and value for every record. It is usually located in `/targets` folder.

```json
{
	"name": "<target name>",
	"type": "<target type>",
	"data": {
		"<record id>": "<value>",
		"<record id>": "<value>",
		...
	},
	...
	<type related fields>
	...
}
```

The supported types are:

 - `ordinal` with additional field `axis` (JSON array containing expected values),
 - `histogram` with additional field `bins` (JSON array containing limits of histogram bins).


## SIMILANT model generator script

In the `python` folder the `script.py` for quick model generation is located.

### Prerequisites

- `python` 3.6.8
- `numpy` 1.16.1
- `scikit-learn` 0.20.2
- `scipy` 1.2.0
- `pandas` 0.24.0

### Input file format

Script is prepared for CSV file (UTF-8 encoding) in following format.

```csv
id,data
<record id 1>,<descriptor value 1>,<descriptor value 2>,...,<descriptor value n_1>
<record id 2>,<descriptor value 1>,<descriptor value 2>,...,<descriptor value n_2>
...
<record id m>,<descriptor value 1>,<descriptor value 2>,...,<descriptor value n_m>
```

### Usage

New models can be added using Python script: 
```sh
python add_model.py -i <path to CSV file> --add
```

All options can be listed using following command: 
```sh
python add_model.py -h
```
