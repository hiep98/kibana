<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-core-server](./kibana-plugin-core-server.md) &gt; [SavedObjectsExportError](./kibana-plugin-core-server.savedobjectsexporterror.md) &gt; [objectTransformError](./kibana-plugin-core-server.savedobjectsexporterror.objecttransformerror.md)

## SavedObjectsExportError.objectTransformError() method

Error returned when a [export transform](./kibana-plugin-core-server.savedobjectsexporttransform.md) threw an error

<b>Signature:</b>

```typescript
static objectTransformError(objects: SavedObject[], cause: Error): SavedObjectsExportError;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  objects | SavedObject\[\] |  |
|  cause | Error |  |

<b>Returns:</b>

SavedObjectsExportError

