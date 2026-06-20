FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj src/backend/KeteKopaki.Api/
RUN dotnet restore src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj

COPY src/backend/KeteKopaki.Api/ src/backend/KeteKopaki.Api/
RUN dotnet publish src/backend/KeteKopaki.Api/KeteKopaki.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "KeteKopaki.Api.dll"]
