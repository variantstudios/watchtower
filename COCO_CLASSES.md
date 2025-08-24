# 🎯 COCO-SSD Object Detection Classes

The COCO-SSD model can detect the following 80 object classes:

## 🚗 Vehicles

- **car** - Automobiles, cars
- **truck** - Trucks, pickup trucks
- **bus** - Buses, coaches
- **motorcycle** - Motorcycles, bikes
- **bicycle** - Bicycles, bikes
- **airplane** - Airplanes, aircraft
- **train** - Trains, locomotives

## 🏠 Objects

- **tv** - Television sets
- **laptop** - Laptop computers
- **cell phone** - Mobile phones, smartphones
- **remote** - TV remotes, controllers
- **keyboard** - Computer keyboards
- **mouse** - Computer mice
- **microwave** - Microwave ovens
- **oven** - Ovens, stoves
- **toaster** - Toasters
- **sink** - Sinks, basins
- **refrigerator** - Refrigerators, fridges
- **book** - Books
- **clock** - Clocks, timepieces
- **vase** - Vases, flower pots
- **scissors** - Scissors
- **teddy bear** - Teddy bears, stuffed animals
- **hair drier** - Hair dryers
- **toothbrush** - Toothbrushes

## 🍽️ Food & Dining

- **bowl** - Bowls, dishes
- **cup** - Cups, mugs
- **fork** - Forks
- **knife** - Knives
- **spoon** - Spoons
- **banana** - Bananas
- **apple** - Apples
- **sandwich** - Sandwiches
- **orange** - Oranges
- **broccoli** - Broccoli
- **carrot** - Carrots
- **hot dog** - Hot dogs
- **pizza** - Pizza
- **donut** - Donuts, doughnuts
- **cake** - Cakes

## 👥 People & Animals

- **person** - People, humans
- **cat** - Cats
- **dog** - Dogs
- **horse** - Horses
- **sheep** - Sheep
- **cow** - Cows, cattle
- **elephant** - Elephants
- **bear** - Bears
- **zebra** - Zebras
- **giraffe** - Giraffes

## 🏀 Sports Equipment

- **baseball bat** - Baseball bats
- **baseball glove** - Baseball gloves
- **tennis racket** - Tennis rackets
- **bottle** - Bottles
- **wine glass** - Wine glasses
- **sports ball** - Sports balls (soccer, basketball, etc.)
- **skateboard** - Skateboards
- **surfboard** - Surfboards
- **kite** - Kites
- **frisbee** - Frisbees

## 🪑 Furniture

- **chair** - Chairs
- **couch** - Couches, sofas
- **bed** - Beds
- **dining table** - Dining tables
- **toilet** - Toilets
- **bench** - Benches

## 🎒 Bags & Containers

- **backpack** - Backpacks, bags
- **handbag** - Handbags, purses
- **suitcase** - Suitcases, luggage
- **umbrella** - Umbrellas

## 🚪 Building Elements

- **door** - Doors
- **window** - Windows
- **fire hydrant** - Fire hydrants
- **stop sign** - Stop signs
- **parking meter** - Parking meters
- **traffic light** - Traffic lights
- **bench** - Benches

## 🚢 Transportation

- **boat** - Boats, ships
- **truck** - Trucks (already listed above)

## 📱 Electronics

- **tv** - Television sets (already listed above)
- **laptop** - Laptop computers (already listed above)
- **cell phone** - Mobile phones (already listed above)
- **remote** - TV remotes (already listed above)
- **keyboard** - Computer keyboards (already listed above)
- **mouse** - Computer mice (already listed above)

## 🍎 Fruits & Vegetables

- **banana** - Bananas (already listed above)
- **apple** - Apples (already listed above)
- **orange** - Oranges (already listed above)
- **broccoli** - Broccoli (already listed above)
- **carrot** - Carrots (already listed above)

---

## 🎯 For Golf Cart Detection

Since "golf cart" isn't a standard COCO class, you have a few options:

### Option 1: Use Similar Vehicle Classes

- **car** - Will detect golf carts as cars
- **truck** - May detect larger golf carts
- **motorcycle** - May detect smaller golf carts

### Option 2: Train a Custom Model

For specific golf cart detection, you would need to:

1. Collect golf cart images
2. Train a custom TensorFlow.js model
3. Replace the COCO-SSD model

### Option 3: Use Multiple Classes

Enable detection for:

- **car** (primary)
- **truck** (backup)
- **motorcycle** (for smaller carts)

### Option 4: Post-Processing

You could add logic to filter car detections based on:

- Size ratio (golf carts are typically smaller than cars)
- Context (if detected in a golf course area)
- Time of day (golf course hours)

---

## 🔧 How to Update Your Settings

To use the most appropriate classes for golf cart detection:

1. **Enable these classes in your settings:**

   - ✅ **car** (primary detection)
   - ✅ **truck** (backup detection)
   - ✅ **motorcycle** (for smaller carts)

2. **Adjust confidence threshold:**

   - Set to 0.4-0.6 for better detection
   - Lower threshold = more detections (but more false positives)
   - Higher threshold = fewer detections (but more accurate)

3. **Test with your specific golf cart:**
   - Try different confidence levels
   - See which class works best for your specific cart
