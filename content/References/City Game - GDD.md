*v0.1 · Draft*

---
## 1. Overview

A minimalist city-builder and factory game where players grow a modern city from raw resource extraction through to a fully functioning urban economy. Inspired by the clean aesthetic of Mini Motorways and the spatial puzzle-solving of rymdkapsel, the game strips away visual complexity while preserving deep systemic depth.

> **Elevator pitch:** Factory builder meets city sim — roads instead of conveyor belts, people instead of automated machines.

### Inspirations

| Game           | Influence                                    | How It Applies                                              |
| -------------- | -------------------------------------------- | ----------------------------------------------------------- |
| Mini Motorways | Minimalist visual style, road-as-puzzle      | Clean geometry, legible systems, road routing challenge     |
| rymdkapsel     | Abstract aesthetic, spatial resource flow    | Board-game look, intentional placement, resource corridors  |
| Factorio       | Tiered resource processing, logistics chains | Resource tiers, factory efficiency, infrastructure planning |

### Core Fantasy

The player is an urban planner and industrial architect simultaneously. Every road laid is both a commuter route and a freight corridor. Every factory placed demands power, water, workers, and raw inputs. The city is a living machine — the player is its designer.

---

## 2. Game Pillars

- **Legibility** — Every system should be readable at a glance. Visual minimalism serves understanding, not just aesthetics.
- **Emergence** — Complexity arises from simple interacting rules, not from many isolated mechanics.
- **Infrastructure as Gameplay** — Roads, pipes, and power lines are not background elements. They are the puzzle.
- **People as Resources** — Citizens commute, work, shop, and have needs that shape city layout.
- **Tiered Progression** — The city grows through technology tiers, unlocking new production chains and energy sources over time.

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

- Resource deposits are distributed to require expansion — the player cannot sit on all resources from the start
- Water bodies (rivers, lakes) bisect the map in interesting ways, forcing bridge and routing decisions
- Varied terrain (hills, flatlands, coast, desert) creates natural city shape pressure
- Starting area: small flat zone with 2–3 nearby Tier 0 deposits; richer and rarer deposits further out

---

## 4. Resource System

Resources are organized into tiers. Higher tiers are manufactured from lower tiers and require increasing infrastructure investment to produce and transport.

> **Land** is an implicit Tier 0 resource — never listed but always consumed. As the city expands, land available for extraction and manufacturing shrinks, creating natural pressure on expansion decisions.
### 4.1 Tier 0 — World Resources

These spawn naturally on the map and are extracted directly. They are the foundation of every production chain.

| Resource | Source / Tile Type | Primary Uses |
|---|---|---|
| **Ore** | Mountain / underground deposits | Metals for construction; coal path for fuel/energy |
| **Stone** | Rocky terrain, quarry sites | Construction material, concrete aggregate |
| **Sand** | Desert tiles, coastal / riverbed | Glass, concrete, silicon (electronics, solar panels) |
| **Oil** | Underground deposits | Fuel, plastics, agricultural chemicals |
| **Wood** | Forest tiles | Construction, paper, early-game fuel |
| **Water** | Rivers, lakes, aquifers | Required by homes, factories, and agriculture |

#### Ore as Dual-Use Resource

Ore deposits contain both metal ore and coal seams, visually distinguished on the map but mechanically identical at extraction. When processed, the player chooses an output path:

- **Smelt path** → metals for construction and manufacturing
- **Burn path** → fuel/energy for power plants

This creates a meaningful allocation decision as the city scales and energy demand grows.

### 4.2 Tier 1 — Processed Goods

Produced in factories from Tier 0 inputs. All factories require energy, water, and workers to operate.

| Product | Inputs | Used For |
|---|---|---|
| Lumber | Wood + Ore (tools) | Construction, furniture |
| Concrete | Stone + Sand + Water | Roads, buildings |
| Glass | Sand + Energy | Windows, electronics |
| Fuel | Oil or Ore (coal path) | Vehicles, power generation |
| Chemicals | Oil + Ore | Fertilizer, pesticides, industrial processes |
| Metal Goods | Ore (smelted) | Machinery, construction |
| Food / Crops | Land + Water + Chemicals (yield boost) | Citizen needs |

### 4.3 Higher Tiers — Progression Examples

As the city grows and citizens become more educated, higher-tier manufacturing unlocks. These are illustrative, not exhaustive.

| Tier   | Example Products                               | Notes                                 |
| ------ | ---------------------------------------------- | ------------------------------------- |
| Tier 2 | Electronics (Sand + Metal + Glass)             | Enables computers, advanced machinery |
| Tier 2 | Vehicles (Metal + Fuel)                        | Unlocks better transport options      |
| Tier 3 | Solar Panels (Electronics + Glass)             | Unlocks clean energy production       |
| Tier 3 | Advanced Construction (Concrete + Electronics) | High-density buildings                |
| Tier 4 | Nuclear Components (Metal + Electronics)       | Late-game high-output energy          |
|        |                                                |                                       |

---

## 5. Logistics Chain

```
Resources → Extractor → Factory → Business → Home
```

Every step in this chain requires physical connection via road, and most require piped utilities (water, power, oil/fuel).

### Buildings

| Building | Description |
|---|---|
| **Extractor** | Cheap, specialized. Pulls a specific Tier 0 resource from the map. |
| **Factory** | Transforms resources into products. Requires energy, water, and employees. Power plants are factories that produce energy. |
| **Business** | Sells products to citizens. Requires energy, water, and at least one employee. |
| **Home** | Houses citizens. Requires energy and water to be livable. |

---

## 6. Citizens

Citizens are agents — they live, commute, work, shop, and go home. They are not just a population number.

- Every citizen needs a **home** to live in
- Every citizen needs a **job** to earn income
- Citizens will travel to **businesses** to purchase needs and wants
- Happiness is influenced by housing quality, access to goods, commute time, and amenities
- **Skill level** increases through education buildings (schools, universities)
- More skilled workers improve factory efficiency; advanced factories *require* skilled workers

### Day/Night Rhythm

| Phase | Activity |
|---|---|
| Morning | Citizens drive from home to workplace |
| Daytime | Workers inside buildings (not rendered); semis run freight routes |
| Evening | Citizens drive home |
| Night | Reduced activity; potential maintenance / low-power state |

---

## 7. Vehicles

Only two vehicle types exist at the base level, keeping the simulation legible.

| Vehicle | Purpose | Behavior |
|---|---|---|
| **Car** | Transports citizens | Citizen drives from home → workplace → home each day |
| **Semi** | Transports goods | Worker commutes to freight depot by car, drives loaded semi to destination, returns |

### Semi Logistics (Agent-Based)

Semis do not spawn autonomously. The flow is:

1. Factory workers load a semi at the source factory
2. A driver citizen commutes to the factory by car
3. Driver gets into the loaded semi and drives it to the destination
4. Driver returns to their car and drives home at end of shift

This means **road congestion near residential areas directly impacts freight delivery** across the entire city.

---

## 8. Infrastructure Networks

Three piped networks run through the city. Each uses the same underlying connection mechanic — buildings need a physical pipe/line path back to a source.

| Network | Source | Infrastructure | Consumers |
|---|---|---|---|
| **Power** | Power plants, solar arrays, etc. | Power lines, transformers, substations | All buildings |
| **Water** | Reservoirs, pumping stations | Water pipes, water towers | Homes, factories, businesses |
| **Oil/Fuel** | Oil extractors, refineries | Fuel pipes | Power plants, industrial buildings |

### Power Grid

- Every building needs a connected path back to a generator
- Lines have **load capacity** — overloaded segments cause brownouts
- **Transformers** step voltage up/down for transmission vs. local distribution
- **Substations** act as distribution hubs for districts
- Industrial zones draw significantly more load than residential
- A plant going offline cascades failures through all connected buildings
- Redundant routing is a strategic option for critical buildings

> The grid is both a resource problem and an infrastructure problem. You can have plenty of fuel but still brownout a district because your substation is undersized.

### Energy Progression

New energy sources unlock as the city advances through tiers:

| Tier | Energy Source | Notes |
|---|---|---|
| Early | Coal/Ore power plant | High output, polluting |
| Early | Oil power plant | Alternative fuel path |
| Mid | Hydroelectric | Requires river/elevation terrain |
| Late | Solar array | Unlocked via Sand → Electronics → Solar Panels chain |
| Late | Nuclear plant | Very high output; unlocked via advanced metal processing |

---

## 9. Progression & Difficulty

### Technology Tiers

Higher-tier buildings and products unlock as the city meets prerequisites. Possible unlock gates (to be decided):

- Population thresholds
- Research (requires educated workers + research buildings)
- Simply having the right inputs available and sufficient infrastructure

### Scaling Challenges

As the city grows, the player faces compounding pressure:

- **Land scarcity** — expansion competes with extraction zones
- **Traffic** — shared roads mean commuter and freight routes congest together
- **Grid capacity** — each new factory adds load; substations must be upgraded or added
- **Worker skill gap** — advanced factories require educated workers; education takes time and space
- **Supply chain length** — longer roads and pipes mean more failure points and more infrastructure cost

---

## 10. Open Questions

- What determines technology tier unlocks — population, research, or resource availability?
- Is there a win condition, or is it a sandbox / score-based game?
- How punishing are failures (brownouts, traffic jams, worker shortages)? Pause and fix, or cascade collapse?
- Are there disasters or external events?
- Multiplayer considerations?
