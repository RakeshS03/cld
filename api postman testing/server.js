const express = require('express');
					const bodyParser = require('body-parser');
					
					const app = express();
					const port = 3000;
					
					// Middleware
					app.use(bodyParser.json());
					
					// In-memory storage for items
					let items = [];
					
					// Prepopulate items with sample data
					const prepopulateItems = () => {
						items.push({ id: 1, name: 'Item 1' });
						items.push({ id: 2, name: 'Item 2' });
						items.push({ id: 3, name: 'Item 3' });
						items.push({ id: 4, name: 'Item 4' });
						items.push({ id: 5, name: 'Item 5' });
					};
					
					prepopulateItems();
					
					// Create a new item (POST)
					app.post('/items', (req, res) => {
						const item = {
							id: items.length + 1,
							name: req.body.name,
						};
						items.push(item);
						res.status(201).json(item);
					});
					
					// Read all items (GET)
					app.get('/items', (req, res) => {
						res.json(items);
					});
					
					// Read a single item (GET)
					app.get('/items/:id', (req, res) => {
						const item = items.find(i => i.id === parseInt(req.params.id));
						if (!item) return res.status(404).send('Item not found');
						res.json(item);
					});
					
					// Update an item (PUT)
					app.put('/items/:id', (req, res) => {
						const item = items.find(i => i.id === parseInt(req.params.id));
						if (!item) return res.status(404).send('Item not found');
					
						item.name = req.body.name;
						res.json(item);
					});
					
					// Delete an item (DELETE)
					app.delete('/items/:id', (req, res) => {
						const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
						if (itemIndex === -1) return res.status(404).send('Item not found');
					
						items.splice(itemIndex, 1);
						res.status(204).send();
					});
					
					// Start the server
					app.listen(port, () => {
						console.log(`Server running at http://localhost:${port}`);
					});
