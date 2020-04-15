
Latest blocks:
```
{
  "_id": "_design/latest",
  "_rev": "2-bc44d877401f66a4f4b5639d30cc106d",
  "views": {
    "latest": {
      "map": "function (doc) {\n  emit(doc.round);\n}"
    }
  },
  "language": "javascript"
}
```

Latest transactions:
```
{
  "_id": "_design/query",
  "_rev": "1-119c9525fa3cee196a5a2771ae265ab5",
  "views": {
    "bytimestamp": {
      "map": "function (doc) {\n  emit(doc.round);\n}"
    }
  },
  "language": "javascript"
}
```
