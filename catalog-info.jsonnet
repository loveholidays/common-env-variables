local backstage = import 'backstage.libsonnet';
local Define = backstage.Define;
local Component = backstage.Component;
local Link = backstage.Link;
local Api = backstage.Api;

Define([
  Component(
    name='GitHub Actions - Common Env Vars',
    description='Normalises github actions environment variables for re-use',
    type='library',
    lifecycle='production',
    repository='loveholidays/common-env-variables',
    owner='digital-product',
    system='cicd',
    tags=['github'],
    dependsOn=[
      'resource:github',
    ],
  )
])