using Ampara.Api.Configuracao;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AdicionarApi(builder.Configuration);

var app = builder.Build();

app.UsarPipelineApi();

app.Run();
