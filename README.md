MostlyJS Poplarjs Handler
=========================

[![Build Status](https://travis-ci.org/mostlyjs/mostly-poplarjs-rest.svg)](https://travis-ci.org/mostlyjs/mostly-poplarjs-rest)

This module provides an express middleware as a RESTful gateway to call microservice writing with [mostly-poplarjs](http://https://github.com/MostlyJS/mostly-poplarjs).

# Usage

## Installation

```bash
npm install mostly-poplarjs-rest
```

## Quick Example

```javascript
import express from 'express';
import bodyParser from 'body-parser';
import nats from 'nats';
import mostly from 'mostly-node';
import poplar from 'mostly-poplarjs-rest';

const trans = new mostly(nats.connect()
const app = express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));

trans.ready(() => {
  app.use(poplar(app, trans, '/api'));
  app.listen(process.env.PORT || 3001);
});

```

# License

MIT