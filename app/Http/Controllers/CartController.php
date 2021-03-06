<?php

namespace App\Http\Controllers;

class CartController extends Controller
{
    public function get()
    {
        $data = [
            'totalItems' => 0,
            'totalPrice' => 0,
            'items' => []
        ];
        $data['items'] = [
            [
                'name' => 'Bag',
                'price' => $this->formatPrice(rand(75, 500)),
                'qty' => rand(1,10),
                'imgSrc' => 'img/products/bag.jpg'
            ],
            [
                'name' => 'Scarf',
                'price' => $this->formatPrice(rand(75, 500)),
                'qty' => rand(1,10),
                'imgSrc' => 'img/products/scarf.jpg'
            ]
        ];
        foreach ($data['items'] as $i ) {
            $data['totalItems'] += $i['qty'];
            $data['totalPrice'] += $i['qty'] * $i['price'];
        }
        /*$data = [
            'totalItems' => rand(1,20),
            'totalPrice' => $this->formatPrice(rand(300, 1000)),
            'items' => [
                [
                    'name' => 'Bag',
                    'price' => $this->formatPrice(rand(75, 500)),
                    'qty' => rand(1,10),
                    'imgSrc' => 'img/products/bag.jpg'
                ],
                [
                    'name' => 'Scarf',
                    'price' => $this->formatPrice(rand(75, 500)),
                    'qty' => rand(1,10),
                    'imgSrc' => 'img/products/scarf.jpg'
                ]
            ]
        ];*/

        return response()->json($data);
    }

    private function formatPrice($price)
    {
        return number_format($price, 2);
    }
}
