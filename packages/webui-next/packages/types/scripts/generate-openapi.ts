import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createGenerator, type Config } from 'ts-json-schema-generator';
import { openApiMeta, openApiPaths } from '../src/openapi';

const schemaTypeNames = [
  'LoginRequest',
  'LoginResponse',
  'RefreshTokenRequest',
  'RefreshTokenResponse',
  'UserInfo',
  'DashboardMetrics',
  'ChartDataPoint',
  'BotInfo',
  'AdapterInfo',
  'DashboardData',
  'DashboardRuntimeInfo',
  'DashboardRealtimeData',
  'FileSystemItemType',
  'FileSystemItem',
  'FileListPayload',
  'FileContentPayload',
  'FileDeleteRequest',
  'FileDeletePayload',
  'FileSaveRequest',
  'FileSavePayload',
  'DirectorySizePayload',
  'SelectionSizeItem',
  'SelectionSizeRequest',
  'SelectionSizePayload',
  'FileBatchDeleteRequest',
  'FileBatchDeletePayload',
  'FileRenameRequest',
  'FileRenamePayload',
  'FileCopyRequest',
  'FileCopyPayload',
  'FilePasteRequest',
  'FilePastePayload',
  'TerminalLogLevel',
  'TerminalLog',
  'BackendHealthStatus',
  'BackendHealthMessage',
  'PluginCategory',
  'PluginSortKey',
  'PluginFeature',
  'PluginListItem',
  'PluginMetaInfo',
  'PluginDetail',
  'PluginStoreListPayload',
  'PluginStoreDetailPayload',
  'ApiResponse_LoginResponse',
  'ApiResponse_RefreshTokenResponse',
  'ApiResponse_DashboardData',
  'ApiResponse_DashboardRealtimeData',
  'ApiResponse_FileListPayload',
  'ApiResponse_FileContentPayload',
  'ApiResponse_FileDeletePayload',
  'ApiResponse_FileSavePayload',
  'ApiResponse_DirectorySizePayload',
  'ApiResponse_SelectionSizePayload',
  'ApiResponse_FileBatchDeletePayload',
  'ApiResponse_FileRenamePayload',
  'ApiResponse_FileCopyPayload',
  'ApiResponse_FilePastePayload',
  'ApiResponse_PluginStoreListPayload',
  'ApiResponse_PluginStoreDetailPayload'
] as const;

const rootDirectory = process.cwd();
const schemaSourcePath = path.resolve(rootDirectory, 'src/openapi-types.ts');
const tsconfigPath = path.resolve(rootDirectory, 'tsconfig.json');
const outputDirectory = path.resolve(rootDirectory, 'openapi');
const outputFile = path.join(outputDirectory, 'openapi.json');

const generatorConfig: Config = {
  path: schemaSourcePath,
  tsconfig: tsconfigPath,
  type: '*',
  expose: 'export',
  topRef: true,
  jsDoc: 'extended',
  skipTypeCheck: false,
  additionalProperties: false
};

const generator = createGenerator(generatorConfig);

const clone = <TValue>(value: TValue): TValue => {
  return JSON.parse(JSON.stringify(value)) as TValue;
};

const rewriteRefs = (input: unknown): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => rewriteRefs(item));
  }
  if (!input || typeof input !== 'object') {
    return input;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === '$ref' && typeof value === 'string') {
      result[key] = value
        .replace('#/definitions/', '#/components/schemas/')
        .replace('#/$defs/', '#/components/schemas/');
      continue;
    }
    if (key === 'definitions' || key === '$defs' || key === '$schema') {
      continue;
    }
    result[key] = rewriteRefs(value);
  }
  return result;
};

const extractSchemas = (): Record<string, unknown> => {
  const schemas: Record<string, unknown> = {};

  for (const typeName of schemaTypeNames) {
    const rawSchema = generator.createSchema(typeName) as Record<string, unknown>;
    const definitions = (rawSchema.definitions ?? rawSchema.$defs ?? {}) as Record<string, unknown>;

    for (const [definitionName, definitionSchema] of Object.entries(definitions)) {
      schemas[definitionName] = rewriteRefs(clone(definitionSchema));
    }

    if (!schemas[typeName]) {
      const topLevelSchema = rawSchema.$ref ? definitions[typeName] ?? rawSchema : rawSchema;
      schemas[typeName] = rewriteRefs(clone(topLevelSchema));
    }
  }

  return schemas;
};

const main = async (): Promise<void> => {
  const openApiDocument = {
    ...openApiMeta,
    paths: openApiPaths,
    components: {
      schemas: extractSchemas()
    }
  };

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(openApiDocument, null, 2)}\n`, 'utf8');

  console.log(`OpenAPI document generated at ${outputFile}`);
};

void main();
