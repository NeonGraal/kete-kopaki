FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj src/backend/KeteKopaki.Api/
COPY src/backend/KeteKopaki.Application/KeteKopaki.Application.csproj src/backend/KeteKopaki.Application/
COPY src/backend/KeteKopaki.Domain/KeteKopaki.Domain.csproj src/backend/KeteKopaki.Domain/
COPY src/backend/KeteKopaki.Infrastructure/KeteKopaki.Infrastructure.csproj src/backend/KeteKopaki.Infrastructure/
RUN dotnet restore src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj

COPY src/backend/ src/backend/
RUN dotnet publish src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "KeteKopaki.Api.dll"]
