class TweetsTable < ActiveRecord::Migration[8.0]
  def change
    create_table :tweets do |t|
      t.text :body
      t.integer :likes_count, default: 0
      t.integer :retweets_count, default: 0

      t.timestamps
    end
  end
end
