FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/backend/KeteKopaki.Jobs/KeteKopaki.Jobs.csproj src/backend/KeteKopaki.Jobs/
RUN dotnet restore src/backend/KeteKopaki.Jobs/KeteKopaki.Jobs.csproj

COPY src/backend/KeteKopaki.Jobs/ src/backend/KeteKopaki.Jobs/
RUN dotnet publish src/backend/KeteKopaki.Jobs/KeteKopaki.Jobs.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:10.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "KeteKopaki.Jobs.dll"]
