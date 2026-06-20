using Ampara.Api.Configuracao;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AdicionarApi(builder.Configuration, builder.Environment);

var app = builder.Build();

app.UsarPipelineApi();

app.Run();
