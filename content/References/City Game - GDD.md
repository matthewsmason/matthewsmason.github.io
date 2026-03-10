# City Untitled — Game Design Document
*v0.4 · Draft*

---

## 1. Overview

A minimalist city-builder and factory game where players grow a modern city from raw resource extraction through to a fully self-sufficient urban economy. Inspired by the clean aesthetic of Mini Motorways and the spatial puzzle-solving of rymdkapsel, the game strips away visual complexity while preserving deep systemic depth.

> **Elevator pitch:** Factory builder meets city sim — roads instead of conveyor belts, people instead of machines.

### Inspirations

| Game | Influence | How It Applies |
|---|---|---|
| Mini Motorways | Minimalist visual style, road-as-puzzle | Clean geometry, legible systems, road routing challenge |
| rymdkapsel | Abstract aesthetic, spatial resource flow | Board-game look, intentional placement, resource corridors |
| SimCity 4 | 2.5D perspective, open-ended sandbox, regional map | Camera angle, city breathing with day/night, neighbor city mechanic |
| Factorio | Tiered resource processing, logistics chains | Resource tiers, factory efficiency, infrastructure planning |

### Core Fantasy

The player is an urban planner and industrial architect simultaneously. Every road laid is both a commuter route and a freight corridor. Every factory placed demands power, water, workers, and raw inputs. The city is a living machine — the player is its designer. There is no win condition. The city is never finished.

---

## 2. Game Pillars

- **Legibility** — Every system should be readable at a glance. Visual minimalism serves understanding, not just aesthetics.
- **Emergence** — Complexity arises from simple interacting rules, not from many isolated mechanics.
- **Infrastructure as Gameplay** — Roads, pipes, and power lines are not background elements. They are the puzzle.
- **People as Resources** — Citizens commute, work, and have needs that shape city layout decisions.
- **Discovery over Prescription** — Technology unlocks through Little Alchemy-style combination discovery, not research trees or timers.

---

## 3. Setting & Visual Style

Modern era. The map is procedurally generated and viewed from a 2.5D isometric perspective (SimCity 4-style). Buildings are clean geometric forms with minimal texturing. Roads are the dominant visual element — the skeleton of the city.

### Aesthetic Targets

- Flat, bold colors with minimal gradients
- Small rendered citizens and vehicles that make the city feel alive
- Visible infrastructure networks: power lines, water pipes, and roads as part of the cityscape
- Day/night cycle: city lights up at dusk as workers return home

### Map Generation

Maps are procedurally generated so no two games are identical. The generator is opinionated:

- Resource deposits distributed to require expansion — the player cannot sit on all resources from the start
- Water bodies (rivers, lakes) bisect the map in interesting ways, forcing bridge and routing decisions
- Varied terrain (hills, flatlands, coast) creates natural city shape pressure
- Starting area: small flat zone with 2–3 nearby Tier 0 deposits; richer and rarer deposits further out

---

## 4. Win Condition

There is none. This is an open-ended sandbox in the SimCity 4 tradition. The player defines their own goals. Informal milestones emerge naturally from the systems:

- Closing an import dependency for the first time
- Surviving and solving a traffic crisis that threatened the whole freight network
- Neighbor cities beginning to import *from* you instead of the other way around
- Watching a city that started with a coal plant and a dirt road eventually manufacture its own computers, electric vehicles, and industrial robots

Failure states exist but are recoverable. If citizen happiness drops too low for too long, population declines — shrinking the labor pool and slowing production. A slow spiral the player can reverse with the right interventions. No game over screen; just a city that pushes back when neglected.

---

## 5. Resource System

Resources are organized into tiers. Higher tiers are manufactured from lower tiers and require increasing infrastructure investment to produce and transport. The combination tree is discovered through play — players combine inputs at factories to discover outputs, with no explicit recipe list shown upfront.

> **The semi truck rule:** If a semi truck couldn't physically carry it, it doesn't belong in the combination tree. Buildings, infrastructure, and ploppables are placed directly by the player and are not tree nodes. The tree contains only manufactured products and materials.

> **Land** is an implicit Tier 0 resource — always consumed by expansion, never listed.

### 5.1 Tier 0 — World Resources

Spawned naturally on the map, extracted directly. The foundation of every production chain.

| Resource | Source | Primary Uses |
|---|---|---|
| **Metal Ore** | Iron, copper, aluminum deposits | Metal, Aluminum, Copper Wire |
| **Rare Ore** | Deep / remote deposits | Rare Metals, Lithium, Gold, Uranium Fuel |
| **Coal** | Shallow seams | Steel (coke), Charcoal, Energy source |
| **Sand** | Coastal / desert / riverbed | Glass, Concrete, Silicon, Cement |
| **Stone** | Rocky terrain, quarry sites | Concrete, Gravel, Brick, Limestone |
| **Oil** | Underground / offshore | Plastic, Chemicals, Natural Gas, Energy source |
| **Wood** | Forest tiles | Lumber, Paper, Charcoal, Energy source |
| **Water** | Rivers, lakes, aquifers | Concrete, Crops, Purified Water, all factories |

### 5.2 Energy

Energy is a single generic node — **a watt is a watt**. How the player generates it is a ploppable decision, not a recipe tree decision. Coal plants, solar arrays, hydro dams, and nuclear plants all produce the same Energy that factories consume. The player's choice of energy source affects city-level stats (pollution, land use, reliability) — not what can be manufactured.

### 5.3 Combination Tree — Base Game Tiers

The base game covers Tier 0 through Tier 8. The arc culminates in the player's city being able to manufacture its own Computers, Industrial Robots, and Electric Vehicles — a recognizable real-world milestone that feels like genuine accomplishment. Tiers 9 and above are expansion content.

**Tier 1 — Basic Processed**
Metal, Lumber, Concrete, Glass, Gravel, Charcoal, Crops, Basic Food, Paper, Limestone

**Tier 2 — Industrial Materials**
Steel, Aluminum, Copper Wire, Plastic, Chemicals, Cement, Asphalt, Brick, Tools, Pipes, Fertilizer, Furniture, Textiles, Natural Gas, Rubber, Tempered Glass, Processed Food, Drywall

**Tier 3 — Refined Materials**
Reinforced Concrete, Tires, Wire/Cable, Insulation, Medicine, Packaging, Lubricant, Ethanol, Fiberglass, Composite, Insulated Panel, Roofing, Structural Frame, Activated Carbon

**Tier 4 — Processed Goods**
Gasoline, Diesel, Petrochemicals, Purified Water, Silicon, Rare Metals, Lithium, Gold, Pharmaceuticals, Machinery, Rare Earth Magnets, Synthetic Rubber, Uranium Fuel

**Tier 5 — Components**
Electric Motor, Solar Panel, Precision Optics, Fiber Optic Cable, High-Perf. Tires, Advanced Ceramics, Resins, Cold Chain

**Tier 6 — Advanced Materials**
Microchip, Battery Pack, Adv. Composite, Carbon Fiber, Advanced Alloy, Transformer

**Tier 7 — Precision Goods**
Electronics, Display Screen, Sensors, Servo/Actuator, Medical Device, High-Eff. Solar Cell, Hydrogen

**Tier 8 — High-Tech** *(base game ceiling)*
Computer, Industrial Robot, Electric Vehicle, Fuel Cell, Smart Meter, Advanced Pharma, Solid-State Battery, Textbook

> The Electric Vehicle is a particularly satisfying endpoint — the player started with imported Diesel-powered semis and ends with a city that manufactures its own EVs from locally produced Batteries, Motors, and Electronics. The arc is legible and earned.

---

## 6. Logistics Chain

```
Resources → Extractor → Factory → Business → Home
```

Every step requires physical road connection. Most steps also require piped utilities (power, water, fuel).

### Ploppable Buildings

Ploppables are placed directly by the player. They are constructed using products and materials from the combination tree but do not appear in the tree themselves.

| Category | Examples |
|---|---|
| **Extraction** | Mine, Oil Derrick, Quarry, Lumber Mill, Water Pump |
| **Production** | Factory (various types), Refinery |
| **Power** | Coal Plant, Oil Plant, Gas Plant, Hydro Dam, Solar Farm, Wind Farm, Nuclear Plant |
| **Water** | Pumping Station, Water Tower, Sewage Treatment |
| **Civic** | School, Hospital, Park |
| **Infrastructure** | Substation, Transformer Station |
| **Housing** | Basic Housing, Standard Housing, Modern Housing |

---

## 7. Road Hierarchy

Roads are not just capacity upgrades — each tier involves real land use tradeoffs. Choosing a road type is a zoning and spatial decision as much as a traffic decision. Traffic congestion and zoning separation are intentional core puzzles, not friction to minimize.

| Type | Width | Capacity | Characteristics |
|---|---|---|---|
| **Road** | 1 tile | Low | Residential scale; cars and light freight only |
| **Avenue** | 2 tiles | Medium | Mixed use; handles semis comfortably |
| **Highway** | 3 tiles + buffers | High | Requires on-ramps; noise buffer affects adjacent zoning value |
| **Freeway** | 4+ tiles | Very High | Bisects neighborhoods; requires interchanges; no direct building access |

### Road as Zoning Puzzle

- A Freeway that solves semi traffic may bisect a residential district, requiring bridges or underpasses to reconnect neighborhoods
- Higher road tiers create noise and pollution buffers that affect adjacent land value and citizen happiness
- The player is always trading capacity against land use and neighborhood livability
- Import freight enters via road connections at the map edge — border connection points are valuable real estate decisions that shape the whole freight network

---

## 8. Citizens

Citizens are agents — they live, commute, work, and have needs that shape city layout. They are not just a population number.

### 8.1 Citizen Variables

Each citizen tracks five variables:

| Variable | Description | Key Drivers |
|---|---|---|
| **Happiness** | Overall life quality; drives population growth or decline | Housing quality, commute length, pollution proximity, food access, park access |
| **Wealth** | Purchasing power; drives demand for higher-tier goods and housing | Job income, capped by Education level |
| **Health** | Physical wellbeing; affects work output efficiency | Pollution exposure, hospital proximity, medicine and pharmaceutical access |
| **Commute** | Time and distance between home and workplace | Road quality, congestion level, physical distance to job |
| **Education** | Unskilled / Skilled / Educated | School proximity; time spent within catchment area |

### 8.2 Education

Education is a per-citizen stat with three levels: **Unskilled, Skilled, Educated**.

- Raised gradually by living within a School's catchment area over time
- Education level caps a citizen's Wealth ceiling — an unskilled worker cannot accumulate beyond a certain wealth level regardless of job income
- Factories and advanced businesses have minimum education requirements for peak efficiency — an Educated workforce running a Microchip factory produces significantly more than an Unskilled one
- Creates spatial pressure: schools must be near housing, which must be reasonably near the factories those workers staff
- The Textbook item (Paper + Computer) boosts School building efficiency as a modifier

### 8.3 Zone-Level Modifiers from Civic Buildings

Civic ploppables apply modifiers to all citizens within their catchment radius:

| Ploppable | Catchment Effect |
|---|---|
| **School** | Raises Education level of residents over time |
| **Hospital** | Raises Health; partially offsets pollution penalty |
| **Park** | Raises Happiness; partially offsets nearby industrial pollution |

### 8.4 Wealth and Demand

Citizen Wealth determines what tier of goods they demand, quietly pulling the player up the combination tree:

- Low wealth → demand for Basic Food, Brick housing
- Mid wealth → demand for Processed Food, Furniture, Standard Housing
- High wealth → demand for higher-tier goods, Modern Housing, better amenities

Educating and enriching citizens is a strategic investment — a wealthier population creates the demand that justifies building more advanced production chains.

### 8.5 Day/Night Rhythm

| Phase | Activity |
|---|---|
| Morning | Citizens drive from home to workplace |
| Daytime | Workers inside buildings (abstracted); semis run freight routes |
| Evening | Citizens drive home |
| Night | Reduced activity; low-power state for some buildings |

---

## 9. Vehicles

Two vehicle types only, keeping the simulation legible.

| Vehicle | Purpose | Behavior |
|---|---|---|
| **Car** | Transports citizens | Citizen drives home → workplace → home each day cycle |
| **Semi** | Transports goods | Driver commutes to factory by car, drives loaded semi to destination, returns |

### Semi Logistics

Semis are not autonomous. A driver citizen must first commute to the source factory by car before freight moves. This means **residential traffic congestion directly delays freight delivery** — the two systems are inseparable. Road design decisions always serve both populations simultaneously.

---

## 10. Infrastructure Networks

Three piped networks run through the city. All use the same connection mechanic — buildings need a physical path back to a source.

| Network | Infrastructure | Consumers |
|---|---|---|
| **Power** | Power lines, Transformers, Substations | All buildings |
| **Water** | Pipes, Pumping Stations, Water Towers | Homes, factories, businesses |
| **Oil/Fuel** | Fuel pipes | Power plants, refineries, industrial buildings |

### Power Grid

- Every building needs a connected path back to a generator
- Lines have load capacity — overloaded segments cause brownouts
- Substations act as distribution hubs for districts
- Industrial zones draw significantly more load than residential
- A plant going offline cascades failures through all connected buildings
- Redundant routing is a valid strategy for critical buildings

---

## 11. Pollution

Pollution is a gradient radius, not a hard distance rule. Factories emit a pollution field that degrades in intensity with distance. Citizens living closer to the source suffer greater Health and Happiness penalties. The player decides how close is acceptable given their city layout and current constraints.

- Early game: land constraints may force factories near housing; the player accepts the penalty
- Mid game: rezoning, pollution buffers, and park placement can offset impact
- Parks partially offset pollution within their catchment but do not eliminate it
- Higher-tier energy sources (solar, wind, nuclear) reduce or eliminate pollution from power generation
- There is no minimum required distance — zoning separation is a player puzzle, not an enforced rule

---

## 12. Progression

### Discovery Mechanic

Technology unlocks through combination discovery — the Little Alchemy model. The player combines inputs at a factory and discovers the output. No explicit recipe list is shown upfront. A discovery log fills in as recipes are found. Progression is capability-gated (do you have the right inputs and infrastructure?) not time-gated.

### Import Dependency

The city begins connected to off-map suppliers via road connections at the map edge. Most goods are imported early at cost. Self-sufficiency is a sliding scale per resource category — the player gradually replaces imports with local production. Import costs provide soft economic pressure without hard failure. This is the game's primary invisible progression timer.

### Neighboring Cities

Adjacent map tiles represent neighboring cities with their own production specializations, functioning as the import suppliers.

- Each neighbor specializes in certain goods (e.g. a mining town has cheap ore but expensive manufactured goods; an agricultural region has cheap food but little industrial output)
- Trade routes use the player's actual road network at the map edge — freight corridors serve internal logistics and external trade simultaneously
- Over-reliance on a single neighbor carries soft risk if their supply becomes expensive or constrained over time
- As the player's city develops, it begins exporting its own specializations back to the region
- Regional identity emerges naturally: the city becomes known for what it produces

### Scaling Pressure

As the city grows, the player faces compounding challenges:

- **Land scarcity** — expansion competes with existing extraction zones and established districts
- **Traffic** — commuter and freight routes share roads and congest together; no clean separation
- **Grid capacity** — each new factory adds electrical load; substations must grow with the city
- **Workforce education gap** — advanced factories require Educated workers; schools take time and space to have effect
- **Supply chain length** — longer roads and pipes mean more infrastructure cost and more failure points

---

## 13. Future Expansion Content

The following are explicitly out of scope for the base game but flagged as natural expansion territory:

- **Tier 9+ materials** — Superconductor, Aerospace Composite, Biomedical Material, Hydrogen Storage, Photovoltaic Film, Smart Cable, and beyond
- **Tier 10 pinnacle materials** — Graphene, Metamaterial, Synthetic Biology, Quantum Dot, Smart Glass, Ultra-Density Battery
- **Cuisine** as a late-game happiness and tourism production chain
- Emergency services (fire, police)
- Waste management
- Airports and jet fuel logistics
- Multiplayer or cooperative region play

---

## 14. Open Questions

- How punishing are failure cascades (brownouts, traffic jams, labor shortages)? Pause-and-fix, or real-time cascade?
- Are there external events or random disasters?
- What is the visual language for citizen happiness and health at the city scale — aggregate overlay maps, or per-building indicators?
- How is combination discovery presented in the UI — drag inputs together at a factory, or a dedicated factory interface?
- What does the import/export economy UI look like — trade ledger, map overlay, or both?
- How are neighboring city profiles generated — fixed archetypes or procedural specializations?
